import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const SelectCompetition = () => {
  const [competitions, setCompetitions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filterTitle, setFilterTitle] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const navigate = useNavigate();
  const limit = 5;

  useEffect(() => {
    fetchCompetitions(page);
  }, [page]);

  const fetchCompetitions = async (page) => {
    try {

      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/competitions`, {
        params: {
          page,
          limit,
          title: filterTitle.trim(),
          date: filterDate,
          location: filterLocation.trim(),
          status: filterStatus
        }
      });

      console.log(res.date.competitions);
      
      setCompetitions(res.data.competitions);
      setTotalPages(res.data.totalPages);
      setPage(page);
    } catch (error) {
      console.error('Error fetching competitions:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this competition?')) {
      try {
        await axios.delete(`${process.env.BACKEND_URL}/api/competitions/${id}`);
        fetchCompetitions(page);
      } catch (error) {
        console.error('Error deleting competition:', error);
        //alert('Failed to delete competition');
      }
    }
  };

  const goToFirst = () => setPage(1);
  const goToLast = () => setPage(totalPages);
  const goToPrev = () => setPage(prev => (prev > 1 ? prev - 1 : prev));
  const goToNext = () => setPage(prev => (prev < totalPages ? prev + 1 : prev));

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Competitions</h3>
        <button className="btn btn-success" onClick={() => navigate('/new')}>
          + New Competition
        </button>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by title"
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by location"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="mb-3 d-flex gap-2">
        <button className="btn btn-primary" onClick={() => fetchCompetitions(1)}>Filter</button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setFilterTitle('');
            setFilterDate('');
            setFilterLocation('');
            setFilterStatus('');
            fetchCompetitions(1);
          }}
          disabled={!filterTitle && !filterDate && !filterLocation && !filterStatus}
        >
          Clear Filter
        </button>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Status</th>
            <th>Style</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {competitions.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">There is no competition</td>
            </tr>
          ) : (
            competitions.map((competition, index) => (
              <tr key={competition._id || index}>
                <td>{(page - 1) * limit + index + 1}</td>
                <td>{competition.title}</td>
                <td>{new Date(competition.date).toLocaleDateString()}</td>
                <td>{competition.location}</td>
                <td>{competition.status}</td>
                <td>{(competition.style || []).join(', ')}</td>
                <td className="d-flex gap-1 flex-wrap">
                  <Link to={`/ViewBrackets/${competition._id}`} className="btn btn-sm btn-outline-primary">
                    View Brackets
                  </Link>
                  <Link to={`/editcompetition?id=${competition._id}`} className="btn btn-sm btn-outline-secondary">
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(competition._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-center gap-2">
        <button className="btn btn-outline-primary" onClick={goToFirst} disabled={page === 1}>
          &lt;&lt; First Page
        </button>
        <button className="btn btn-outline-primary" onClick={goToPrev} disabled={page === 1}>
          &lt; Previous Page
        </button>
        <span className="align-self-center">Page {page} from {totalPages}</span>
        <button className="btn btn-outline-primary" onClick={goToNext} disabled={page === totalPages}>
          Next &gt;
        </button>
        <button className="btn btn-outline-primary" onClick={goToLast} disabled={page === totalPages}>
          Last Page &gt;&gt;
        </button>
      </div>
    </div>
  );
};

export default SelectCompetition;
