import React from 'react';
import { Header, InputFields, Section, Button, Ul } from '@src/components/styles/common';
import { H2, H1, P } from '@src/components/styles/text';
import sort, {bubbleSort, selectionSort, insertionSort, quickSort} from '@src/algorithm/sort';
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
  SELECTION = 'selection',
  INSERTION = 'insertion',
  QUICK = 'quick'
};

const SORT_FUNC_MAP = {
  [SortTypeEnum.BUBBLE]: bubbleSort,
  [SortTypeEnum.SELECTION]: selectionSort,
  [SortTypeEnum.INSERTION]: insertionSort,
  [SortTypeEnum.QUICK]: quickSort
}

const createRandomNumber = (minRange: number = 10, maxRange: number = 100) => {
  return Math.floor(Math.random() * (maxRange - minRange)) + (minRange + 1);
}

const Sort: React.FC = () => {
  const array = React.useMemo(() => {
    const maxSize = createRandomNumber(500, 600);
    const array = [];
    for(let i = 0; i < maxSize; i ++) {
      array[i] = createRandomNumber(0, 1000);
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
        text: `${value} ??????`,
        value
      }
    })
  }, []);

  const handleClickButton = React.useCallback(() => {
    const [startName, endName] = [`start-${sortType}-sort`, `end-${sortType}-sort`];
    performance.mark(startName);
    sort(array, SORT_FUNC_MAP[sortType])
      .then((sortedArray) => {
        setSortedArray(sortedArray);
        performance.mark(endName);
        performance.measure(sortType, startName, endName);
      });
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
        <H1>??????</H1>
        <InputFields>
          <Select options={sortTypes} value={sortType} onChange={handleChangeType} />
        </InputFields>
      </Header>
      <Section>
        <H2>??????</H2>
        <Toggle title={<P>?????? ??????</P>}>
          <P>{arrayString}</P>
        </Toggle>
        {sortedArrayString && (
          <Toggle title={<P>?????? ???</P>}>
            <P>{sortedArrayString}</P>
          </Toggle>
        )}
      </Section>
      <Section>
        <Button type="button" onClick={handleClickButton}>????????????</Button>
      </Section>
      {!!records.length && (
        <Section>
          <Header>
            <H2>??????</H2>
            <P>??? ????????? ????????? ????????? ???????????? ????????? ????????? ?????????, ????????? ???????????? ????????? ?????? ????????? ??? ????????????.</P>
          </Header>
          <Ul>
            {records.map(({duration, name}) => (
              <li key={`${name}-${duration}`}>
                {name} ?????? ???????????? - {duration}
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