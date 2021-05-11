import React from 'react';
import Graph from '@src/lib/Graph';
import { H1, H2, H3, P } from '@src/components/styles/text';
import { Article, Button, Header, Section, Ul } from '@src/components/styles/common';
import { Input } from '@src/components/styles/input';
import Select, { Option } from '@src/components/Select';
import styled from '@emotion/styled';

const MOCK_STATIONS = [
  '강남', '선릉', '(신)용산', '건대', '노원', '신림', '혜화', '홍대', '합정',
  '강남구청', '명동', '이태원'
]

const MOCK_ROUTES: [string, string, number][] = [
  ['강남', '선릉', 2], ['강남', '신림', 8], ['강남', '건대', 10], ['강남', '홍대', 17], ['강남', '합정', 16],
  ['선릉', '강남', 2], ['선릉', '강남구청', 2],
  ['(신)용산', '혜화', 16], ['(신)용산', '홍대', 4],
  ['건대', '노원', 14], ['건대', '강남', 10], ['건대', '선릉', 8], ['건대', '신림', 18], ['건대', '강남구청', 3], ['건대', '홍대', 16],
  ['노원', '건대', 14], ['노원', '혜화', 9],  ['노원', '강남구청', 17],
  ['신림', '강남', 8], ['신림', '선릉', 10], ['신림', '합정', 8], ['신림', '홍대', 9], ['신림', '건대입구', 18],
  ['홍대', '강남', 17], ['홍대', '합정', 1], ['홍대', '신림', 9], ['홍대', '선릉', 18], ['홍대', '건대', 16], ['홍대', '(신)용산', 4],
  ['합정', '홍대', 1], ['합정', '이태원', 8], ['합정', '강남', 16], ['합정', '신림', 8], ['합정', '선릉', 19], ['합정', '건대', 17],
  ['강남구청', '건대', 3], ['강남구청', '선릉', 2], ['강남구청', '노원', 17],
  ['명동', '혜화', 4], ['명동', '(신)용산', 5], ['명동', '노원', 13],
  ['혜화', '명동', 4], ['혜화', '(신)용산', 9], ['혜화', '노원', 9],
  ['이태원', '합정', 14]
]

const GraphPage: React.FC = () => {
  const graph = React.useMemo(() => new Graph(), []);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [arcFrom, setArcFrom] = React.useState<string>('');
  const [arcTo, setArcTo] = React.useState<string>('');
  const [searchFrom, setSearchFrom] = React.useState<string>('');
  const [searchTo, setSearchTo] = React.useState<string>('');

  const [locals, setLocals] = React.useState<Option[]>(() => {
    return MOCK_STATIONS.map((value) => {
      graph.addVertex(value);
      return {text: value, value};
    })
  });
  const [arcs, setArcs] = React.useState<[string, string][]>(() => {
    return MOCK_ROUTES.map(([from, to, distance]) => {
      graph.addArc(from, to, distance);
      return [from, to];
    })
  });
  const [searchRoutes, setSearchRoutes] = React.useState<{distance: number, text: string}[][]>([]);
  
  const handleInputChange = React.useCallback(({target: {value}}) => {
    setInputValue(value);
  }, [setInputValue]);

  const appendVertex = React.useCallback(() => {
    setInputValue('');
    setLocals(prev => {
      if(prev.findIndex((option) => option.value === inputValue) === -1) {
        graph.addVertex(inputValue);
        return [...prev, {text: inputValue, value: inputValue}];
      }
      return prev;
    });
  }, [inputValue, setInputValue, setLocals, graph]);

  const appendArc = React.useCallback(() => {
    setArcs(prev => {
      if(!prev.filter((arcs) => arcs[0] === arcFrom && arcs[1] === arcTo).length) {
        graph.addArc(arcFrom, arcTo, Math.random() * 10);
        return [
          ...prev,
          [arcFrom, arcTo]
        ]
      }
      return prev;
    });
  }, [arcFrom, arcTo, graph]);

  const searchRoute = React.useCallback(() => {
    const routeVertex = graph.searchRoute(searchFrom, searchTo);
    if(routeVertex) {
      const routes = Graph.routesFlat(routeVertex);
      setSearchRoutes(routes.map((route) => {
        return route.map(({vertex, distance}) => ({
          distance,
          text: vertex.key
        }));
      }));
    } else {
      alert('가능한 경로가 없습니다.');
    }
  }, [graph, searchTo, searchFrom, setSearchRoutes]);
  

  const handleChangeArcFrom = React.useCallback((value) => {
    setArcFrom(value);
  }, [setArcFrom]);
  const handleChangeArcTo = React.useCallback((value) => {
    setArcTo(value);
  }, [setArcTo]);
  const handleChangeSearchFrom = React.useCallback((value) => {
    setSearchFrom(value);
  }, [setSearchFrom]);
  const handleChangeSearchTo = React.useCallback((value) => {
    setSearchTo(value);
  }, [setSearchTo]);

  return (
    <>
      <Header>
        <H1>그래프 자료구조를 다루어보자</H1>
      </Header>
      <Section>
        <Header>
          <H2>지하철 역</H2>
          <P>
            지하철 역이 나열되어 있다. 해당 역들은 동일한 노선끼리 이동 할 수 있으며, 환승역에서만 다른 노선으로 갈아 탈 수 있다.<br/>
            역들을 설정하고 갈 수 있는 경로를 설정 한 뒤 출발지부터 도착지까지의 경로를 알아보자 
          </P>
        </Header>
      </Section>
      <HalfSection>
        <Article>
          <Header>
            <H3>역 목록</H3>
            <InputFields>
              <InputEntity> 
                <Input value={inputValue} onChange={handleInputChange} />
                <Button onClick={appendVertex} disabled={!inputValue}>역 추가</Button>
              </InputEntity>
            </InputFields>
          </Header>
          <Ul>
            {locals.map(({text}) => (
              <li key={text}>{text}</li>
            ))}
          </Ul>
        </Article>
        <Article>
          <Header>
            <H3>가능한 경로 목록</H3>
            <InputFields>
              <InputEntity>
                <Select value={arcFrom} options={locals} disabled={arcTo} onChange={handleChangeArcFrom} />
                <InpuUnit>→</InpuUnit>
                <Select value={arcTo} options={locals} disabled={arcFrom} onChange={handleChangeArcTo} />
              </InputEntity>
              <Button onClick={appendArc} disabled={!arcFrom || !arcTo}>경로 추가</Button>
            </InputFields>
          </Header>
          <HalfSection>
            {Array(Math.ceil(arcs.length/20)).fill(0).map((_, idx) => {
              let max = (idx+1) * 20;
              const min = max - 20;
              if(max > arcs.length) {
                max = arcs.length;
              }
              
              return (
                <article key={idx}>
                  <Ul>
                    {Array(max-min).fill('').map((_, i) => {
                      const [from, to] = arcs[min + i];
                      return (
                        <li key={`${from}-${to}`}>
                          {from} → {to}
                        </li>
                      )
                    })}
                  </Ul>
                </article>
              )
            })}
          </HalfSection>
        </Article>
      </HalfSection>
      <Section>
        <Header>
          <H2>경로 찾기</H2>
          <InputFields>
              <InputEntity>
                <Select value={searchFrom} options={locals} disabled={searchTo} onChange={handleChangeSearchFrom} />
                <InpuUnit>→</InpuUnit>
                <Select value={searchTo} options={locals} disabled={searchFrom} onChange={handleChangeSearchTo} />
              </InputEntity>
              <Button onClick={searchRoute} disabled={!searchFrom || !searchTo}>경로 찾기</Button>
            </InputFields>
        </Header>
        <Ul>
          {searchRoutes.map((route, idx) => (
            <li key={idx}>
              {route.map(({text, distance}, idx) => (
                <span key={`${text}-${distance.toString()}`}>
                  {!!idx && '→'} {text} (총 거리: {distance}) 
                </span>
              ))}
            </li>
          ))}
        </Ul>
      </Section>
    </>
  )
}

GraphPage.displayName = 'GraphPage';
export default GraphPage;

const HalfSection = styled(Section)`
  display: flex;
  align-items: flex-start;
  > article {
    width: 50%;

    & ~ article {
      margin-top: 0 !important;
    }
  }
`;

const InputEntity = styled.div`
  display: flex;
  align-items: center;
  & ~ & {
    margin-left: 50px;
  }
`;

const InputFields = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  padding-bottom: 20px;
`;

const InpuUnit = styled.p`
  padding: 0 10px;
  font-size: 18px;
  font-weight: bold;
`;