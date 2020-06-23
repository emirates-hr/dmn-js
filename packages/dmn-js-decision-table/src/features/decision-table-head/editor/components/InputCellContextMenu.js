import { Component } from 'inferno';

import InputEditor from './InputEditor';

import {
  inject
} from 'table-js/lib/components';


export default class InputCellContextMenu extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      inputSource: null,
      inputProperties: [],
      inputProperty: null
    };

    inject(this);

    this.persistChanges = this.debounceInput(this.persistChanges);

    this._expressionLanguages = context.injector.get('expressionLanguages');
    this._inputSources = context.injector.get('inputSources');
  }

  componentDidMount() {
    const text = this.getValue('text');
    if (text && text !== '' && text.indexOf('.') !== -1) {
      const textSplitted = text.split('.');
      this.setState({
        inputSource:  textSplitted[0],
        inputProperty: textSplitted[1]
      });
    }
  }

  persistChanges = () => {
    const { input } = this.props.context;

    const { unsaved } = this.state;

    if (!unsaved) {
      return;
    }

    const {
      inputVariable,
      label,
      inputSource,
      inputProperty,
      ...inputExpressionProperties
    } = unsaved;

    var changes = { };

    if ('inputVariable' in unsaved) {
      changes.inputVariable = inputVariable;
    }

    if ('label' in unsaved) {
      changes.label = label;
    }

    if ('inputSource' in unsaved) {
      changes.inputSource = inputSource;
    }

    if ('inputProperty' in unsaved) {
      changes.inputProperty = inputProperty;
      inputExpressionProperties.text = this.state.inputSource + '.' + inputProperty;
    }

    if (hasKeys(inputExpressionProperties)) {
      changes.inputExpression = inputExpressionProperties;
    }

    this.modeling.updateProperties(input, changes);

    const newState = {
      inputSource: inputSource || this.state.inputSource,
      inputProperty: inputProperty || this.state.inputProperty,
      unsaved: false
    };

    if ('inputSource' in unsaved) {
      newState.inputProperties = this._inputSources.getProperties(inputSource);
    }

    this.setState(newState);
  }

  handleChange = (changes) => {
    this.setState({
      unsaved: {
        ...this.state.unsaved,
        ...changes
      }
    }, this.persistChanges);
  };

  getValue(attr) {
    let { input } = this.props.context;

    const { unsaved } = this.state;

    let target = input;

    // input variable stored in parent
    if (attr === 'expressionLanguage' || attr === 'text' || attr === 'inputSource') {
      target = target.inputExpression;
    }

    // TODO should be removed. This fixes the feel language
    if (attr === 'expressionLanguage') {
      return 'feel';
    }

    return unsaved && attr in unsaved ? unsaved[attr] : target.get(attr);
  }

  render() {
    const defaultLanguage = this._expressionLanguages.getDefault('inputHeadCell'),
          expressionLanguages = this._expressionLanguages.getAll(),
          inputSources = this._inputSources.getAll();

    return (
      <InputEditor
        expressionLanguage={ this.getValue('expressionLanguage') }
        expressionLanguages={ expressionLanguages }
        inputSources={ inputSources }
        defaultExpressionLanguage={ defaultLanguage }
        inputVariable={ this.getValue('inputVariable') }
        label={ this.getValue('label') }
        text={ this.getValue('text') }
        inputSource={ this.state.inputSource }
        inputProperties={ this.state.inputProperties }
        inputProperty={ this.state.inputProperty }
        onChange={ this.handleChange } />
    );
  }
}

InputCellContextMenu.$inject = [
  'debounceInput',
  'modeling',
  'injector'
];


// helpers //////////////////////

function hasKeys(obj) {
  return Object.keys(obj).length;
}