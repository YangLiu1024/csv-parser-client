import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import React from 'react'

const InfiniteTable = () => {
    const [datas, setDatas] = React.useState({})
    const [count, setCount] = React.useState(0)

    const isItemLoaded = index => !!datas[index];

    const loadMoreItems = (startIndex, stopIndex) => {
        console.log('load data for ', startIndex, ' ', stopIndex)
        return fetch(`http://localhost:8080/parse?filePath=C:\\Users\\yangliu\\Downloads\\big.csv&startIndex=${startIndex}&stopIndex=${stopIndex}`)
            .then(res => res.json())
            .then(items => {
                let loaded = items.map((item, index) => ({[index + startIndex] : item})).reduce((i1,i2) => ({...i1, ...i2}))
                setDatas(d => ({...d, ...loaded}))
            })
    }
    React.useEffect(() => {
        fetch(`http://localhost:8080/count?filePath=C:\\Users\\yangliu\\Downloads\\big.csv`)
            .then(res => res.json())
            .then(c => setCount(c))
    }, [])

    const Row = ({index, style}) => {
        let item = datas[index]
        let label;
        if (item) {
            label = Object.keys(item).slice(0, 2).map(k => item[k]).join('-')
        } else {
            label = 'Loading'
        }
        return (
            <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
                {label}
            </div>
        )
    }

    return (
        <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={count}
            loadMoreItems={loadMoreItems}>
                {
                    ({onItemsRendered, ref}) => (
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '1 1 auto', height: '98vh' }}>
                                <AutoSizer>
                                    {
                                        ({ width, height }) => (
                                            <List
                                                className="List"
                                                height={height}
                                                width={width}
                                                itemCount={count}
                                                itemSize={35}
                                                onItemsRendered={onItemsRendered}
                                                ref={ref}>
                                                {Row}
                                            </List>
                                        )
                                    }
                                </AutoSizer>
                            </div>
                        </div>

                    )
                }
        </InfiniteLoader>
    )
}

function useDebounce(value, delay) {
    const [debounceValue, setDebounceValue] = React.useState(value)

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceValue(value)
        }, delay);
        return () => clearTimeout(handler)
    }, [value, delay])

    return debounceValue
}

export default InfiniteTable