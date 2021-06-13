import React from 'react';
import { Header, InputFields, Section, Button, Ul } from '@src/components/styles/common';
import { H2, H1, P } from '@src/components/styles/text';
import sort, {bubbleSort, selectionSort} from '@src/algorithm/sort';
import Select, { Option } from '@src/components/Select';
import Toggle from '@src/components/common/Toggle';

interface RecordPerformance {
  name: string;
  entryType: 'measure' | 'mark' | 'frame';
  startTime: number;
  duration: number;
}

enum SortTypeEnum {
  BUBBLE = 'bubble',
  SELECTION = 'selection'
};

const SORT_FUNC_MAP = {
  [SortTypeEnum.BUBBLE]: bubbleSort,
  [SortTypeEnum.SELECTION]: selectionSort
}

const createRandomNumber = (minRange: number = 10, maxRange: number = 100) => {
  return Math.floor(Math.random() * (maxRange - minRange)) + (minRange + 1);
}

const Sort: React.FC = () => {
  const array = React.useMemo(() => {
    const maxSize = createRandomNumber(500, 600);
    const array = [];
    for(let i = 0; i < maxSize; i ++) {
      array[i] = createRandomNumber();
    }
    return array;
  }, []);  
  const arrayString = React.useMemo(() => array.join(', '), [array]);
  const [sortedArray, setSortedArray] = React.useState<number[]>([]);
  const sortedArrayString = React.useMemo(() => sortedArray.join(', '), [sortedArray]);
  
  const [sortType, setSortType] = React.useState<SortTypeEnum>(SortTypeEnum.BUBBLE);

  const performance = React.useMemo(() => window.performance, []);
  const [records, setRecords] = React.useState<RecordPerformance[]>([]);
  
  const observer = React.useMemo(() => {
    return new PerformanceObserver((list) => {
      const entries = list.getEntries();

      for(let i = 0, length = entries.length; i < length; i ++) {
        const entry: RecordPerformance = {
          name: entries[i].name,
          entryType: entries[i].entryType as 'measure' | 'mark' | 'frame', 
          startTime: entries[i].startTime,
          duration: entries[i].duration
        }
        setRecords(prev => ([
          ...prev,
          entry
        ]))
        
      }
    })
  }, [setRecords]);

  const sortTypes: Option[] = React.useMemo(() => {
    return Object.values(SortTypeEnum).map((value: string) => {
      return {
        text: `${value} 정렬`,
        value
      }
    })
  }, []);

  const handleClickButton = React.useCallback(() => {
    const [startName, endName] = [`start-${sortType}-sort`, `end-${sortType}-sort`];
    performance.mark(startName);
    setSortedArray(sort(array, SORT_FUNC_MAP[sortType]));
    performance.mark(endName);
    performance.measure(sortType, startName, endName);
  }, [array, sortType, setSortedArray]);

  const handleChangeType = React.useCallback((type) => {
    setSortType(type);
  }, [setSortType]);
  

  React.useEffect(() => {
    performance.clearMarks();
    performance.clearMeasures();
    setSortedArray([]);
  }, [sortType, setSortedArray]);

  React.useEffect(() => {
    observer.observe({entryTypes: ['measure']});
    
    return () => {
      observer.disconnect();
    }
  }, [observer]);


  return (
    <>'
      <Header>
        <H1>정렬</H1>
        <InputFields>
          <Select options={sortTypes} value={sortType} onChange={handleChangeType} />
        </InputFields>
      </Header>
      <Section>
        <H2>배열</H2>
        <P>{arrayString}</P>
        {sortedArrayString && (
          <Toggle title={<P>정렬 후</P>}>
            <P>{sortedArrayString}</P>
          </Toggle>
        )}
      </Section>
      <Section>
        <Button type="button" onClick={handleClickButton}>정렬하기</Button>
      </Section>
      {!!records.length && (
        <Section>
          <Header>
            <H2>결과</H2>
            <P>이 결과는 순전히 정렬을 하는데에 걸리는 시간이 아니며, 컴퓨터 프로세스 상황에 따라 달라질 수 있습니다.</P>
          </Header>
          <Ul>
            {records.map(({duration, name}) => (
              <li key={`${name}-${duration}`}>
                {name} 정렬 소요시간 - {duration}
              </li>

            ))}
          </Ul>
        </Section>
      )}
    </>
  );
}

Sort.displayName = 'Sort';
export default Sort;