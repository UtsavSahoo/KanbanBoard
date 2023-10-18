import { useState, useEffect } from 'react'
import './Global.css'

function App() {
  const [isDisplayOpen, setIsDisplayOpen] = useState(false)
  const [groupValue, setGroupValue] = useState(0)
  const [orderValue, setOrderValue] = useState(0)
  // const [data, setData] = useState({})
  const [apiData, setApiData] = useState({})
  // const [sortedData, setSortedData] = useState([])
  const [groupedData, setGroupedData] = useState({})

  const priorityMap = {
    4: ["Urgent"],
    3: ["High"],
    2: ["Medium"],
    1: ["Low"],
    0: ["No priority"]
  }

  function blockHeader(groupBy) {
    if (groupValue == 1) {
      for (let index = 0; index < apiData.users.length; index++) {
        if (apiData.users[index].id == groupBy)
          return apiData.users[index].name
      }
    }
    else if (groupValue == 2) {
      return priorityMap[groupBy];
    }
    return groupBy
  }

  function updateData(data) {
    let sortedData = []
    if (orderValue == 0 && Object.entries(data).length != 0) {
      sortedData = data.tickets.sort((a, b) => a.priority - b.priority)
    }
    else if (orderValue == 1 && Object.entries(data).length != 0) {
      sortedData = data.tickets.sort((a, b) => (a.title >= b.title ? 1 : -1))
    }

    if (groupValue == 0 && sortedData.length != 0) {
      setGroupedData(sortedData.reduce((acc, item) => {
        const status = item.status;
        if (!(status in acc)) {
          acc[status] = [];
        }
        acc[status].push(item);
        return acc;
      }, {}))
    }
    else if (groupValue == 1 && sortedData.length != 0) {
      setGroupedData(sortedData.reduce((acc, item) => {
        const userId = item.userId;
        if (!(userId in acc)) {
          acc[userId] = [];
        }
        acc[userId].push(item);
        return acc;
      }, {}))
    }
    else if (groupValue == 2 && sortedData.length != 0) {
      setGroupedData(sortedData.reduce((acc, item) => {
        const priority = item.priority;
        if (!(priority in acc)) {
          acc[priority] = [];
        }
        acc[priority].push(item);
        return acc;
      }, {}))
    }
    console.log(data, sortedData, groupedData)
    return groupedData
  }

  let finalData = {}
  useEffect(() => {
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then((response) => response.json())
      .then((apiData) => {
        setApiData(apiData)
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    updateData(apiData)
  }, [apiData, groupValue, orderValue])


  return (
    <div className=''>
      <div className='header'>
        <button onClick={() => setIsDisplayOpen(!isDisplayOpen)}>
          Display
        </button>
        {
          isDisplayOpen && (
            <div className='displayWindow'>
              <div className='dropDownRow'>
                <div className='dropDownName'>Grouping</div>
                <select className='dropDown' onChange={(e) => setGroupValue(e.target.value)}>
                  <option value="0">Status</option>
                  <option value="1">User</option>
                  <option value="2">Priority</option>
                </select>
              </div>
              <div className='dropDownRow'>
                <div className='dropDownName'>Ordering</div>
                <select className='dropDown' onChange={(e) => setOrderValue(e.target.value)} >
                  <option value="0">Priority</option>
                  <option value="1">Title</option>
                </select>
              </div>
            </div>
          )
        }
      </div>

      <div className='mainBlock'>
        {Object.keys(groupedData).map((groupedBby) => (
          <div key={groupedBby} className='columnBlock' >
            <div className='blockHeader'>
              <div className='blockLogo'></div>
              <div className='blockTitle'>{blockHeader(groupedBby)}</div>
              <div className='afterTitle'>+</div>
            </div>


            {groupedData[groupedBby].map((item) => (
              <div key={item.id} className='tile'>
                <div className='tileIdDp'>
                  <div className='tileId'>{item.id}</div>
                </div>
                <div className='tileTitle'>
                  {item.title}
                </div>
                <div className='tileFeatureArray'>
                  {item.tag.map((itemTag) => (
                    <div className='tileFeature'>
                      {itemTag}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

    </div>
  )
}

export default App
