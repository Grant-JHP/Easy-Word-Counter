import './App.css';

import React, { useState } from 'react';

import { Button, Checkbox, Divider, Flex, Layout, Progress, Input, Typography, Col, message, Descriptions, DescriptionsProps } from 'antd';

const { Content, Header, Footer } = Layout;
const { TextArea } = Input;
const { Title, Text } = Typography;

let text: string = '';
let count: number = 0;

function Main() {
  const [msgAPI, contextHolder] = message.useMessage();

  const [type, SetType] = useState('default');
  const [progress, SetProgress] = useState(0);

  const [excludeQuotes, SetExcludeQuotes] = useState(true);
  const [excludeMLA9, SetExcludeMLA9] = useState(true);
  const [excludeSqrBrackets, SetExcludeSqrBrackets] = useState(false);

  async function GetWordCount() {
    if (text == '') {
      msgAPI.open({
        type: 'error',
        content: 'Please enter your essay before getting your word count!',
      });
    }
    else {
      SetType('loading');
      for (let i = 0; i < 100; i += 1) {
        if (i < 50) await new Promise(f => setTimeout(f, 5));
        else await new Promise(f => setTimeout(f, 2.5));
        SetProgress(i);
      }
      SetProgress(100);
      await new Promise(f => setTimeout(f, 500));
      
      count = text[0] != ' ' ? 1 : 0;
      let escChar: string = '';

      for (let i = 0; i < text.length; i++) {
        // Count spaces
        if (text[i] == ' ' && escChar == '') count++;

        // Exit quotes/brackets
        else if (text[i] == escChar) {
          if (excludeMLA9 && escChar == '”' && text[i + 2] == '(') escChar = ')';
          else if (excludeMLA9 && escChar == '"' && text[i + 2] == '(') escChar = ')';
          else {
            escChar = '';
            continue;
          }
        }
        
        // Enter into quote/bracket
        if (escChar != '') continue;
        else if ((excludeQuotes || excludeMLA9) && text[i] == '“') {
          if (text[i - 1] == ' ') count --; escChar = '”';
        } else if ((excludeQuotes || excludeMLA9) && text[i] == '"') {
          if (text[i - 1] == ' ') count --; escChar = '"';
        } else if (excludeSqrBrackets && text[i] == '[') {
          if (text[i - 1] == ' ') count --; escChar = ']';
        }
      }

      SetType('result');
    }
  }

  const resultItems: DescriptionsProps['items'] = [
    { key: '1', label: 'Raw count', children: (text.split(' ').length + ' words') },
    { key: '2', label: 'Excluded count', children: (text.split(' ').length - count + ' words') },
    { key: '3', label: 'Final count', children: (count + ' words')}
  ];

  function SidePanel() {
    if (type == 'loading') { return (
      <div id='side-panel' className='loading'>
        <Divider>Progress</Divider>
        <Flex justify='space-around' align='center'>
          <div id='progress-div'>
            <Progress percent={progress} type='circle' strokeColor={{'0%': '#108ee9', '100%': '#87d068',}} />
          </div>
        </Flex>
      </div>
    )}
    else if (type == 'result') { return (
      <div id='side-panel'>
        <Divider orientation='left'>Results</Divider>
        <Descriptions column={1} items={resultItems} />
        <Button onClick={() => {text = text; SetType('default');}}>Return</Button>
        <Divider orientation='left'>Notes</Divider>
        <ul>
          <li>
          <Text className='note'>Excluding MLA9 quotes does not exclude the 'works cited' list.</Text>
          </li>
          <li>
            <Text className='note'>Please report any problems/suggestions to the developer.</Text>
          </li>
        </ul>
      </div>
    )}
    else { return (
      <div id='side-panel'>
        <Divider orientation='left'>Settings</Divider>
        <Col>
          <Checkbox onClick={_e => SetExcludeQuotes(!excludeQuotes)} checked={excludeQuotes} defaultChecked={true}>
            Exclude regular quotes
          </Checkbox> <br />

          <Checkbox onClick={_e => SetExcludeMLA9(!excludeMLA9)} checked={excludeMLA9} defaultChecked={true}>
            Exclude MLA9 quotes
          </Checkbox> <br />

          <Checkbox onClick={_e => SetExcludeSqrBrackets(!excludeSqrBrackets)} checked={excludeSqrBrackets} defaultChecked={false}>
            Exclude square brackets
          </Checkbox>
        </Col>
        <Divider orientation='left'>Run</Divider>
        <Button onClick={_e => GetWordCount()}>Get Word Count</Button>
      </div>
    )}
  }

  return (
    <Layout>
      {contextHolder}
      <Header>
        <TitleBar />
      </Header>
      <div id='background'>
        <Content id='content'>
          <Flex id='flex-box' justify='space-around' align='center'>
            <TextBox />
            <SidePanel />
          </Flex>
        </Content>
        <Disclaimer />
      </div>
    </Layout>
  )
}

const TitleBar: React.FC = () => (
  <Flex id='title-bar' align='center' gap={64}>
    <img id='icon' src='/icon.svg' />
    <Title id='title'>Easy Word Counter</Title>
  </Flex>
)

const TextBox: React.FC = () => (
  <TextArea id='text-box' onChange={e => {text = e.target.value;}} cols={5} rows={10} />
)

const Disclaimer: React.FC = () => (
  <Footer id='disclaimer'>
    Disclaimer: Any information generated by this website should be used as a guide only and should not be a part of any submission of work.
  </Footer>
)

export default function App() {
  return <Main />;
}