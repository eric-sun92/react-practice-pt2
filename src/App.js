import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [people, setPeople] = useState([]);
  const [flattenedLocations, setFlattenedLocations] = useState({
    headers: [],
    data: [],
  });

  const [sortDirection, setSortDirection] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filterQuery = (rows) => {
    return rows.filter((row) => {
      return Object.values(row).some((s) =>
        ("" + s).toLowerCase().includes(searchQuery)
      );
    });
  };

  const flattenLocations = (locations) => {
    const location = locations[0];
    // const flattenedLocationHeaders = getHeaders(location);
    const data = [];
    for (const { street, coordinates, timezone, ...rest } of locations) {
      data.push({
        ...rest,
        name: street.name,
        number: street.number,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        description: timezone.description,
        offset: timezone.offset,
      });
    }
    const flattenedHeaders = getHeaders(data[0]);
    // console.log({ headers: flattenedHeaders, data });
    return { headers: flattenedHeaders, data };
  };

  const getHeaders = (location) => {
    //go thru each key
    //if key has a value that isnt an object push it to flattenedLocations
    let objectKeys = [];

    Object.keys(location).forEach((key) => {
      if (typeof location[key] !== "object") {
        objectKeys.push(key);
      } else {
        objectKeys = [...objectKeys, ...getHeaders(location[key])];
      }
    });
    return objectKeys;
  };

  const sortColumn = (sortKey) => {
    const newFlattenedLocations = {
      ...flattenedLocations,
    };

    if (sortDirection) {
      newFlattenedLocations.data.sort((a, b) => {
        const sortKeyValueA = a[sortKey];
        const sortKeyValueB = b[sortKey];

        if (sortKeyValueA < sortKeyValueB) return -1;
        if (sortKeyValueA > sortKeyValueB) return 1;
        return 0;
      });
    } else {
      newFlattenedLocations.data.sort((a, b) => {
        const sortKeyValueA = a[sortKey];
        const sortKeyValueB = b[sortKey];

        if (sortKeyValueA > sortKeyValueB) return -1;
        if (sortKeyValueA < sortKeyValueB) return 1;
        return 0;
      });
    }
    setSortDirection((previous) => !previous);

    setFlattenedLocations(newFlattenedLocations);
  };

  useEffect(() => {
    axios
      .get("https://randomuser.me/api/?results=20")
      .then((res) => {
        setPeople(res.data.results);
        setFlattenedLocations(
          flattenLocations(res.data.results.map(({ location }) => location))
        );
        // setUserLocations(JSON.stringify(res.data.results[0].location));
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <input
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
      />
      <table>
        <thead>
          <tr>
            {flattenedLocations.headers.map((flatLocation, index) => (
              <th key={index} onClick={() => sortColumn(flatLocation)}>
                {flatLocation}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filterQuery(flattenedLocations.data).map((location, idx) => (
            <tr key={idx}>
              {flattenedLocations.headers.map((header, header_idx) => (
                <td key={header_idx}>{location[header]}</td>
              ))}
              {/* {Object.values(location).map((header, header_idx) => (
                <td key={header_idx}>{header}</td>
              ))} */}
            </tr>
          ))}
        </tbody>
        {/* {flattenedLocations.data.map((data, index) => (
          <div key={index}>{data}</div>
        ))} */}
      </table>
    </div>
  );
}

export default App;
