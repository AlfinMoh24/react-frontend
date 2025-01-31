import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import useResizeObserver from '../../hook/useResizeObserver';

DataTable.use(DT);

const Penghuni = () => {
  const [penghuni, setPenghuni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/penghuni')
      .then(response => {
        setPenghuni(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  useResizeObserver(() => {
    console.log('Resize observed!');
  });

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
    setShowBackdrop(true);
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:8000/api/penghuni/${selectedId}`)
      .then(() => {
        setPenghuni(penghuni.filter(p => p.id !== selectedId));
        setLoadingButton(true);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error deleting penghuni:', error);
        window.location.reload();
      });
  };

  const closeModal = () => {
    setShowModal(false);
    setShowBackdrop(false);
  };

  const columns = [
    { title: 'No', data: 'id', render: (data, type, row, meta) => meta.row + 1 },
    { title: 'Nama Lengkap', data: 'nama_lengkap' },
    { title: 'Nomor Telepon', data: 'nomor_telepon' },
    { title: 'Status Penghuni', data: 'status_penghuni' },
    {
      title: 'Aksi',
      data: 'id',
      render: (data) => `
        <button class="me-1 btn btn-success fs-9 text-white p-1 px-2" style="background-color: #4e008593;" onclick="window.location.href='/penghuni/${data}'">
          <i class="fa-solid fa-circle-info"></i>
        </button>
        <button class="btn btn-warning fs-9 text-white p-1 px-2" onclick="window.location.href='/penghuni/edit/${data}'">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn btn-danger fs-9 text-white p-1 px-2 delete-btn" data-id="${data}">
          <i class="fa-solid fa-trash"></i>
        </button>
      `,
      orderable: false
    }
  ];

  useEffect(() => {
    const handleDeleteEvent = (event) => {
      if (event.target.closest('.delete-btn')) {
        const id = event.target.closest('.delete-btn').getAttribute('data-id');
        handleDeleteClick(id);
      }
    };

    document.addEventListener('click', handleDeleteEvent);
    return () => {
      document.removeEventListener('click', handleDeleteEvent);
    };
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-4 container">
        <div className="spinner-border"></div>
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="my-3">
      <h4>Daftar Penghuni</h4>
      <div className="card shadow-sm fs-9 mt-4">
        <div className="card-header d-flex justify-content-between align-items-center p-3">
          <h5 className="card-title mb-0">Tabel Penghuni</h5>
          <button className="btn btn-primary px-3 py-1 rounded-1 fs-9" onClick={() => navigate('/tambah-penghuni')}>
            <i className="fa-solid fa-circle-plus me-2"></i>
            Tambah Penghuni
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <DataTable
              data={penghuni}
              columns={columns}
              options={{
                responsive: true,
                paging: true,
                searching: true,
                ordering: true,
                info: true,
                language: {
                  search: ""
                }
              }}
              className="table table-striped table-bordered"
            />
          </div>
        </div>
      </div>
      {showBackdrop && <div className="modal-backdrop fade show"></div>}
      {showModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Konfirmasi Penghapusan</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p>Apakah Anda yakin ingin menghapus penghuni ini?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary fs-8" onClick={closeModal}>Batal</button>
                <button type="submit" className="btn btn-danger fs-8" disabled={loadingButton} onClick={handleDelete}>
                  {loadingButton ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Penghuni;
