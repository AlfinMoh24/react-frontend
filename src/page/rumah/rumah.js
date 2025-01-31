import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import useResizeObserver from '../../hook/useResizeObserver';

DataTable.use(DT);

const DaftarRumah = () => {
  const [rumah, setRumah] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/rumah')
      .then((response) => {
        setRumah(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  useResizeObserver(() => {
    console.log('Resize observed!');
  });

  const columns = [
    { title: 'No', data: 'id', render: (data, type, row, meta) => meta.row + 1 },
    { title: 'Kode Rumah', data: 'kode_rumah' },
    { title: 'Status Rumah', data: 'status_rumah' },
    {
      title: 'Aksi',
      data: 'id',
      render: (data) => `
        <button class="me-1 btn btn-success fs-9 text-white p-1 px-2" style="background-color: #4e008593;" onclick="window.location.href='/rumah/${data}'">
          <i class="fa-solid fa-circle-info"></i>
        </button>
        <button class="btn btn-danger fs-9 text-white p-1 px-2" id="delete-btn-${data}" data-id="${data}">
          <i class="fa-solid fa-trash"></i>
        </button>
      `,
      orderable: false
    }
  ];

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
    setShowBackdrop(true);
  };

  const handleDelete = () => {
    setLoadingButton(true);
    axios.delete(`http://localhost:8000/api/rumah/${selectedId}`)
      .then((response) => {
        setRumah(rumah.filter(r => r.id !== selectedId));
        setLoadingButton(false);
        window.location.reload(); // Refresh page to reflect changes
      })
      .catch((error) => {
        console.error('Error deleting rumah:', error);
        setLoadingButton(false);
        window.location.reload(); // Refresh page even if deletion fails
      });
  };

  const closeModal = () => {
    setShowModal(false);
    setShowBackdrop(false);
  };

  useEffect(() => {
    const deleteButtons = document.querySelectorAll('.btn-danger');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        handleDeleteClick(id);
      });
    });

    return () => {
      deleteButtons.forEach((button) => {
        button.removeEventListener('click', () => {
          const id = button.getAttribute('data-id');
          handleDeleteClick(id);
        });
      });
    };
  }, [rumah]);

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
      <h4>Daftar Rumah</h4>
      <div className="card shadow-sm fs-9 mt-4">
        <div className="card-header d-flex justify-content-between align-items-center p-3">
          <h5 className="card-title mb-0">Tabel Rumah</h5>
          <button className="btn btn-primary px-3 py-1 rounded-1 fs-9" onClick={() => navigate('/tambah-rumah')}>
            <i className="fa-solid fa-circle-plus me-2"></i>
            Tambah Rumah
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <DataTable
              data={rumah}
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
      {showBackdrop &&
        <div className="modal-backdrop fade show"></div>
      }
      {showModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Konfirmasi Penghapusan</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p>Apakah Anda yakin ingin menghapus rumah ini?</p>
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

export default DaftarRumah;
