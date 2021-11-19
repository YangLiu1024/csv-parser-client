import { useTable } from 'react-table'
import React from 'react'
import './table.css'
import { FixedSizeList as List} from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

function Table() {
  const [data, setData] = React.useState([])
  const count = React.useMemo(() => data.length, [data])
  //const [columns, setColumns] = React.useState([])

  React.useEffect(() => {
    // async function fetchData() {
    //   setLoading(true)

    //   //let res = await fetch('http://localhost:8080/csv?filePath=C:\\Localdata\\羽毛球比赛报销\\8483593_202107140926385999.csv\\8483593_202107140926385999.csv')
    //   let res = await fetch('http://localhost:8080/csv?filePath=C:\\Users\\yangliu\\Downloads\\normal.csv')
    //   //return await res.json()
    //   const reader = res.body.getReader()
    //   let decoder = new TextDecoder('utf8')
    //   let row;
    //   let init = ''
    //   while (!row?.done) {
    //     row = await reader.read()
    //     let text = init + decoder.decode(row.value)
    //     matched = text.match
    //     console.log()
    //   }

    // fetch('http://localhost:8080/csv?filePath=C:\\Users\\yangliu\\Downloads\\big.csv')
    //   .then(response => response.body)
    //   .then(rb => {
    //     const reader = rb.getReader();

    //     return new ReadableStream({
    //       start(controller) {
    //         // The following function handles each data chunk
    //         function push() {
    //           // "done" is a Boolean and value a "Uint8Array"
    //           reader.read().then(({ done, value }) => {
    //             // If there is no more data to read
    //             if (done || !value) {
    //               controller.close();
    //               return;
    //             }
    //             // Get the data and send it to the browser via the controller
    //             console.log('data')
    //             controller.enqueue(value);
    //             push();
    //           })
    //         }

    //         push();
    //       }
    //     });
    //   })
    //   .catch(err => console.log('receiving error'))
    //   .then(stream => {
    //     // Respond with our stream
    //     return new Response(stream, { headers: { "Content-Type": "application/json" } }).json();
    //   })
    //   .catch(err => console.log('convert error', err))
    //   .then(result => {
    //     // Do things with result
    //     console.log(result);
    //   });
    //}
    // fetchData().then(data => {
    //   if (data && data.length > 0) {
    //     setColumns(Object.keys(data[0]).filter(name => name !== '__parsed_extra').map(name => ({
    //       Header: name.trim(),
    //       accessor: name.trim()
    //     })))
    //     setData(data)
    //     console.log(columns, data)
    //   }
    //   setLoading(false)
    // })
    fetch('http://localhost:8080/csv?filePath=C:\\Users\\yangliu\\Downloads\\big.csv')
      .then(res => {
        setData([])
        let reader = res.body.getReader()
        let decoder = new TextDecoder()
        return read('')
        function read(left) {
          return reader.read().then(({ value, done }) => {
            if (done) return
            let chunk = left + decoder.decode(value)
            let os = chunk.split('\n')
            left = os.pop()
            setData(e => e.concat(os.map(d => JSON.parse(d))))
            return read(left)
          })
        }
      })
  }, [])

  const Row = ({index, style}) => {
    let d = data[index]
    let key = Object.keys(d)[0]
    return (
      <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
        {key} - {d[key]}
      </div>
    )
  }
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: '1 1 auto', height: '98vh' }}>
        <AutoSizer>
          {({ height, width }) => <List
            className="List"
            height={height}
            width={width}
            itemCount={count}
            itemSize={35}>
            {Row}
          </List>}
        </AutoSizer>
      </div>
    </div>

  )
  // const {
  //   getTableProps,
  //   getTableBodyProps,
  //   headerGroups,
  //   rows,
  //   prepareRow,
  // } = useTable({ columns, data })

  // return (
  //   <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
  //     <thead>
  //       {headerGroups.map(headerGroup => (
  //         <tr {...headerGroup.getHeaderGroupProps()}>
  //           {headerGroup.headers.map(column => (
  //             <th
  //               {...column.getHeaderProps()}
  //               style={{
  //                 borderBottom: 'solid 3px red',
  //                 background: 'aliceblue',
  //                 color: 'black',
  //                 fontWeight: 'bold',
  //               }}
  //             >
  //               {column.render('Header')}
  //             </th>
  //           ))}
  //         </tr>
  //       ))}
  //     </thead>
  //     <tbody {...getTableBodyProps()}>
  //       {rows.map(row => {
  //         prepareRow(row)
  //         return (
  //           <tr {...row.getRowProps()}>
  //             {row.cells.map(cell => {
  //               return (
  //                 <td
  //                   {...cell.getCellProps()}
  //                   style={{
  //                     padding: '10px',
  //                     border: 'solid 1px gray',
  //                     background: 'papayawhip',
  //                   }}
  //                 >
  //                   {cell.render('Cell')}
  //                 </td>
  //               )
  //             })}
  //           </tr>
  //         )
  //       })}
  //     </tbody>
  //   </table>
  // )
}

export default Table;