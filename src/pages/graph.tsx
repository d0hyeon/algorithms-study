import React from 'react';
import Graph from '@src/lib/Graph';
import { H1, H2, H3, P } from '@src/components/styles/text';
import { Article, Button, Header, Section, Ul } from '@src/components/styles/common';
import { Input } from '@src/components/styles/input';
import Select, { Option } from '@src/components/Select';
import styled from '@emotion/styled';

const MOCK_LOCALS = [
  '용산', '노원', '강남', '역삼', '인천', '신림', '하남', '혜화', '건대', '종로'
]

const MOCK_ROUTES: [string, string, number][] = [
  ['건대', '노원', 3],
  ['건대', '강남', 4],
  ['노원', '하남', 4],
  ['노원', '건대', 3],
  ['노원', '강남', 6],
  ['노원', '용산', 5], 
  ['용산', '혜화', 6],
  ['용산', '종로', 4],
  ['용산', '강남', 4],
  ['용산', '신림', 2],
  ['종로', '혜화', 2],
  ['종로', '노원', 3],
  ['신림', '인천', 3],
  ['신림', '강남', 3],
  ['혜화', '노원', 1],
  ['혜화', '하남', 6],
]

const GraphPage: React.FC = () => {
  const graph = React.useMemo(() => new Graph(), []);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [arcFrom, setArcFrom] = React.useState<string>('');
  const [arcTo, setArcTo] = React.useState<string>('');
  const [searchFrom, setSearchFrom] = React.useState<string>('');
  const [searchTo, setSearchTo] = React.useState<string>('');

  const [locals, setLocals] = React.useState<Option[]>(() => {
    return MOCK_LOCALS.map((value) => {
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
          <H2>배송  지역</H2>
          <P>
            쿠팡맨이 열심히 배송을 하고있다. <br/>
            여러 지역에 분포 된 배송지역의 경로를 찾아보자 
          </P>
        </Header>
      </Section>
      <HalfSection>
        <Article>
          <Header>
            <H3>지역 목록</H3>
            <InputFields>
              <InputEntity> 
                <Input value={inputValue} onChange={handleInputChange} />
                <Button onClick={appendVertex} disabled={!inputValue}>지역 추가</Button>
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
          <Ul>
            {arcs.map(([from, to]) => (
              <li key={`${from}-${to}`}>
                {from} → {to}
              </li>
            ))}
          </Ul>
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
              <Button onClick={searchRoute} disabled={!searchFrom || !searchTo}>경로 추가</Button>
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