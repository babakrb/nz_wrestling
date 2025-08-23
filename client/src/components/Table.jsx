import React from 'react';

const Table = ({ events }) => {
  return (
    <table className="table table-bordered table-striped">
      <thead className="table-light">
        <tr>
          <th>Title</th>
          <th>Date</th>
          <th>Location</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {events.map((e, i) => (
          <tr key={i}>
            <td>{e.title}</td>
            <td>{e.date}</td>
            <td>{e.location}</td>
            <td>{e.status}</td>
            <td>
              <a href="#">View bracket</a> | <a href="#">View result</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;