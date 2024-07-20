import './App.css';

import React from 'react';
import { useState } from 'react';
import { Button, Checkbox, Divider, Flex, Layout, Progress, Input, Typography, Col, message } from 'antd';

const { Content, Header, Footer } = Layout;
const { TextArea } = Input;
const { Title, Text } = Typography;

const App: React.FC = () => {

  // Side Panel
  let type: string = '';
  let progress: number = 0;

  const defaultPanel = (
    <div style={{width: '20%'}}>
      <Divider orientation='left'>Settings</Divider>
      <Col>
        <Checkbox onClick={() => {regularQuotes = !regularQuotes;}} defaultChecked={true}>Exclude regular quotes</Checkbox>
        <br />
        <Checkbox onClick={() => {mla9Quotes = !mla9Quotes;}} defaultChecked={true}>Exclude MLA9 quotes</Checkbox>
        <br />
        <Checkbox onClick={() => {squareBrackets = !squareBrackets;}}>Exclude square brackets</Checkbox>
      </Col>
      <Divider orientation='left'>Run</Divider>
      <Button onClick={_e => GetWordCount()}>Get Word Count</Button>
    </div>
  );

  const loadingPanel = (
    <div>
      <Progress percent={progress} type='circle' />
    </div>
  );

  const resultsPanel = (
    <div>
      <Divider orientation='left'>Results</Divider>
      <Text>Raw count: XXXX</Text>
      <Text>Excluding MLA9 quotes: XXXX</Text>
    </div>
  );

  const [sidePanel, updatePanel] = useState(defaultPanel);

  // Word Count Func
  const [messageApi, contextHolder] = message.useMessage();

  let regularQuotes: boolean = true;
  let mla9Quotes: boolean = false;
  let squareBrackets: boolean = false;
  let text: string = '';
  let count: number = 0;

  function GetWordCount() {
    if (text == '') {
      messageApi.open({
        type: 'error',
        content: 'Please enter your essay before getting your word count!',
      });
    }
    else {
      console.log("Debug!");
      count = 1;
      let escChar: string = '';

      type = 'loading';
      progress = 5;

      for (let i = 0; i < text.length; i++) {
        if (text[i] == ' ' && escChar == '') count++;
        else if (text[i] == '“') escChar = '”';
        else if (text[i] == '(') escChar = ')';
        else if (text[i] == '[') escChar = ']';
        else if (text[i] == escChar) {
          if (escChar == '”' && text[i + 2] == '(') escChar = ')';
          else escChar = '';
        }
      }

      progress = 100;
    }
  }

  return (
    <Layout>
      {contextHolder}
      <Header>
        <Flex align='center' gap={50} style={{height: 48, paddingTop: 8}}>
          <img src='/icon.svg' style={{marginTop: 10}} />
          <Title style={{color: 'white'}}>Easy Word Counter</Title>
        </Flex>
      </Header>
      <div id='background' style={{height: 'calc(100vh - 64px)'}}>
        <Content id='background' style={{height: 'calc(100vh - 131px)'}}>
          <Flex justify='space-around' align='center' style={{height: 'inherit'}}>
            <TextArea onChange={(e) => {text = e.target.value;}} cols={5} rows={10} autoSize={true} style={{width: '70%', minHeight: '50%', maxHeight: '60%'}} />
            <sidePanel />
          </Flex>
        </Content>
        <Footer style={{textAlign: 'center', background: 'none'}}>
          Legal disclaimer: Any information generated by this website should be used as a guide only.
        </Footer>
      </div>
    </Layout>
  );
}

export default App