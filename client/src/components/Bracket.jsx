import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Bracket = () => {
  const { id } = useParams();
  const [competition, setCompetition] = useState(null); // ✅
  const [brackets, setBrackets] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filterWrestler, setFilterWrestler] = useState('');
  const [filterMat, setFilterMat] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const limit = 5;

  useEffect(() => {
    fetchCompetition();   // ✅
    fetchBrackets(page);
  }, [page]);

  const fetchCompetition = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/competitions/${id}`);
      setCompetition(res.data);
    } catch (error) {
      console.error('Error fetching competition:', error);
    }
  };

  const fetchBrackets = async (page) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/brackets`, {
        params: {
          competitionId: id,
          page,
          limit,
          wrestler: filterWrestler.trim(),
          mat: filterMat.trim(),
          category: filterCategory.trim()
        }
      });
      setBrackets(res.data.bracket);
      setTotalPages(res.data.totalPages);
      setPage(page);
    } catch (error) {
      console.error('Error fetching brackets:', error);
    }
  };

  const goToFirst = () => setPage(1);
  const goToLast = () => setPage(totalPages);
  const goToPrev = () => setPage(prev => (prev > 1 ? prev - 1 : prev));
  const goToNext = () => setPage(prev => (prev < totalPages ? prev + 1 : prev));

  return (
    <div className="container my-4">
      <h3>Brackets</h3>

      {/* ✅ نمایش اطلاعات competition */}
      {competition && (
        <div className="alert alert-info">
          <strong>{competition.title}</strong> | {new Date(competition.date).toLocaleDateString()} | {competition.location} | Status: <strong>{competition.status}</strong>
        </div>
      )}

      {/* فرم فیلتر */}
      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by wrestler name"
            value={filterWrestler}
            onChange={(e) => setFilterWrestler(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by mat"
            value={filterMat}
            onChange={(e) => setFilterMat(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-3 d-flex gap-2">
        <button className="btn btn-primary" onClick={() => fetchBrackets(1)}>Filter</button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setFilterWrestler('');
            setFilterMat('');
            setFilterCategory('');
            fetchBrackets(1);
          }}
          disabled={!filterWrestler && !filterMat && !filterCategory}
        >
          Clear Filter
        </button>
      </div>

      {/* جدول */}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Mat</th>
            <th>Category</th>
            <th>Round</th>
            <th>Match</th>
            <th>Wrestler 1 (Blue)</th>
            <th>Wrestler 2 (Red)</th>
            <th>Time</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {brackets.length === 0 ? (
            <tr><td colSpan="9" className="text-center">There is no bracket</td></tr>
          ) : (
            brackets.map((bracket, index) => (
              <tr key={bracket._id || index}>
                <td>{(page - 1) * limit + index + 1}</td>
                <td>{bracket.mat}</td>
                <td>{bracket.category}</td>
                <td>{bracket.round}</td>
                <td>{bracket.match}</td>
                <td style={{ color: 'blue' }}>{bracket.wrestler1}</td>
                <td style={{ color: 'red' }}>{bracket.wrestler2}</td>
                <td>{bracket.time}</td>
                <td>{new Date(bracket.date).toISOString().slice(0, 10)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-center gap-2">
        <button className="btn btn-outline-primary" onClick={goToFirst} disabled={page === 1}>&lt;&lt; First Page</button>
        <button className="btn btn-outline-primary" onClick={goToPrev} disabled={page === 1}>&lt; Previous Page</button>
        <span className="align-self-center">Page {page} from {totalPages}</span>
        <button className="btn btn-outline-primary" onClick={goToNext} disabled={page === totalPages}>Next &gt;</button>
        <button className="btn btn-outline-primary" onClick={goToLast} disabled={page === totalPages}>Last Page &gt;&gt;</button>
      </div>
    </div>
  );
};

export default Bracket;
