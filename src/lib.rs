use wasm_bindgen::prelude::*;

use std::fmt::Display;

use ethabi::token::{LenientTokenizer, Tokenizer};
use ethabi::Param;

fn js_value<T: Display>(e: T) -> JsValue {
  return JsValue::from(&format!("{}", e));
}

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub struct Contract {
  inner: Box<ethabi::Contract>,
}

#[wasm_bindgen]
impl Contract {
  #[wasm_bindgen(constructor)]
  pub fn new(json: &str) -> Result<Contract, JsValue> {
    let rcontract = serde_json::from_str::<ethabi::Contract>(json);
    let contract = rcontract.map_err(js_value)?;

    Ok(Self {
      inner: Box::new(contract),
    })
  }

  #[wasm_bindgen]
  pub fn function(&self, name: &str) -> Option<ContractFunction> {
    let function = self.inner.function(name).ok()?;

    Some(ContractFunction {
      inner: Box::new(function.clone()),
    })
  }

  #[wasm_bindgen(js_name = constructr)]
  pub fn constructor(&self) -> Option<ContractConstructor> {
    let constructor = self.inner.constructor()?;

    Some(ContractConstructor {
      inner: Box::new(constructor.clone()),
    })
  }

  #[wasm_bindgen]
  pub fn event(&self, name: &str) -> Option<ContractEvent> {
    let event = self.inner.event(name).ok()?;

    Some(ContractEvent {
      inner: Box::new(event.clone()),
    })
  }
}

#[wasm_bindgen]
pub struct ContractConstructor {
  inner: Box<ethabi::Constructor>,
}

#[wasm_bindgen]
impl ContractConstructor {
  #[wasm_bindgen]
  pub fn inputs(&self) -> Vec<JsValue> {
    let inputs = &self.inner.inputs;
    let f = |it: &Param| js_value(&it.kind);
    inputs.iter().map(f).collect()
  }

  #[wasm_bindgen]
  pub fn encode_input(&self, code: Vec<u8>, values: Vec<JsValue>) -> Result<Vec<u8>, JsValue> {
    let tokens = values
      .iter()
      .enumerate()
      .map(|(i, value)| tokenize(&self.inner.inputs[i].kind, value))
      .collect::<Result<Vec<_>, _>>()?;
    let bytes = self.inner.encode_input(code, &tokens).map_err(js_value)?;

    Ok(bytes)
  }

  #[wasm_bindgen]
  pub fn decode_input(&self, bytes: Vec<u8>) -> Result<Vec<JsValue>, JsValue> {
    let types: Vec<ethabi::ParamType> = self.inner.inputs.iter().map(|p| p.kind.clone()).collect();
    let tokens = ethabi::decode(&types, &bytes).map_err(js_value)?;
    let values = tokens.iter().map(js_value).collect();

    Ok(values)
  }
}

pub fn tokenize(kind: &ethabi::ParamType, value: &JsValue) -> Result<ethabi::Token, JsValue> {
  let string = value.as_string().ok_or(js_value("Invalid value"))?;
  let token = LenientTokenizer::tokenize(kind, &string).map_err(js_value)?;

  Ok(token)
}

#[wasm_bindgen]
pub struct ContractFunction {
  inner: Box<ethabi::Function>,
}

#[wasm_bindgen]
impl ContractFunction {
  #[wasm_bindgen]
  pub fn inputs(&self) -> Vec<JsValue> {
    let inputs = &self.inner.inputs;
    let f = |it: &Param| js_value(&it.kind);
    inputs.iter().map(f).collect()
  }

  #[wasm_bindgen]
  pub fn outputs(&self) -> Vec<JsValue> {
    let outputs = &self.inner.outputs;
    let f = |it: &Param| js_value(&it.kind);
    outputs.iter().map(f).collect()
  }

  #[wasm_bindgen]
  pub fn encode_input(&self, values: Vec<JsValue>) -> Result<Vec<u8>, JsValue> {
    let tokens = values
      .iter()
      .enumerate()
      .map(|(i, value)| tokenize(&self.inner.inputs[i].kind, value))
      .collect::<Result<Vec<_>, _>>()?;
    let bytes = self.inner.encode_input(&tokens).map_err(js_value)?;

    Ok(bytes)
  }

  #[wasm_bindgen]
  pub fn decode_input(&self, bytes: Vec<u8>) -> Result<Vec<JsValue>, JsValue> {
    let tokens = self.inner.decode_input(&bytes).map_err(js_value)?;
    let values = tokens.iter().map(js_value).collect();

    Ok(values)
  }

  #[wasm_bindgen]
  pub fn decode_output(&self, bytes: Vec<u8>) -> Result<Vec<JsValue>, JsValue> {
    let tokens = self.inner.decode_output(&bytes).map_err(js_value)?;
    let values = tokens.iter().map(js_value).collect();

    Ok(values)
  }
}

#[wasm_bindgen]
pub struct ContractEvent {
  inner: Box<ethabi::Event>,
}

#[wasm_bindgen]
impl ContractEvent {
  // TODO
}
