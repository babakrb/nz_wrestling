import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';



const ViewBrackets = () => {
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


const excelDateToJSDate = (serial) => {
  const utc_days = Math.floor(serial - 25569); // 25569 = days between 1900-01-01 and 1970-01-01
  const utc_value = utc_days * 86400; // seconds per day
  const date_info = new Date(utc_value * 1000); // JS timestamp
  return date_info.toISOString().slice(0, 10); // return yyyy-mm-dd
};



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



const handleExport = () => {
  const worksheet = XLSX.utils.json_to_sheet(brackets);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Brackets');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, `brackets_${id}.xlsx`);
};


const handleImport = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (evt) => {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // ✅ تصحیح تاریخ
    const cleanedData = jsonData.map(item => {
      const rawDate = item.date;
      let formattedDate = null;

      if (!rawDate) {
        formattedDate = null;
      } else if (typeof rawDate === 'number') {
        // تاریخ سریالی اکسل
        formattedDate = excelDateToJSDate(rawDate);
      } else if (typeof rawDate === 'string') {
        // تاریخ متنی مثل 2025-08-10
        formattedDate = new Date(rawDate).toISOString().slice(0, 10);
      }

      return {
        ...item,
        date: formattedDate
      };
    });

    try {
      await axios.post(`http://localhost:5000/api/brackets/import/${id}`, cleanedData);
      fetchBrackets(1);
    } catch (error) {
      console.error('Error importing brackets:', error);
    }
  };
  reader.readAsArrayBuffer(file);
};




  const goToFirst = () => setPage(1);
  const goToLast = () => setPage(totalPages);
  const goToPrev = () => setPage(prev => (prev > 1 ? prev - 1 : prev));
  const goToNext = () => setPage(prev => (prev < totalPages ? prev + 1 : prev));

  return (
    <div className="container my-4">
      <h3>Brackets</h3>
<div className="mb-3">
  <Link to={`/newbracket/${id}`} className="btn btn-danger">
    ➕ New Bracket
  </Link>
</div>

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

<div className="mb-3 d-flex gap-2">
  <label className="btn btn-success mb-0">
    Import Brackets
    <input type="file" accept=".xlsx, .xls, .csv" onChange={handleImport} hidden />
  </label>
  <button className="btn btn-outline-success" onClick={handleExport}>Export Brackets</button>
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
	       <th>Actions</th>
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
		<td>
          		<Link
  				to={`/editbracket/${bracket._id}`}
  				state={{ returnPath: `/viewbrackets/${id}` }}
  				className="btn btn-sm btn-warning me-2"
				>
				Edit
			</Link>


			<Link
  				to={`/deletebracket/${bracket._id}`}
  				state={{ returnPath: `/viewbrackets/${id}` }}
  				className="btn btn-sm btn-danger me-2"
				>
  				Delete
			</Link>
<Link
    to={`/editresult/${bracket._id}`}
    state={{ returnPath: `/viewbrackets/${id}` }}
    className="btn btn-sm btn-info"
  >
    Result
  </Link>
          		
        	</td>
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

export default ViewBrackets;
