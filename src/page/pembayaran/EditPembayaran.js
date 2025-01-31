import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditPembayaran = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Mengambil ID dari URL
    const [pembayaranData, setPembayaranData] = useState(null);
    const [formData, setFormData] = useState({
        status_pembayaran: 'Lunas', // Default status
    });
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    // Ambil data pembayaran berdasarkan ID
    useEffect(() => {
        axios.get(`http://localhost:8000/api/pembayaran/${id}`)
            .then(response => {
                setPembayaranData(response.data.data);
                setFormData({
                    status_pembayaran: response.data.data.status_pembayaran,
                });
            })
            .catch(error => {
                console.error('Error fetching pembayaran data:', error);
            });
    }, [id]);

    // Handle perubahan input form
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert(null); // Reset alert
        setLoading(true);

        try {
            await axios.put(`http://localhost:8000/api/pembayaran/${id}`, formData);
            setAlert({ type: 'success', message: 'Status pembayaran berhasil diperbarui!' });
            setLoading(false);
            setTimeout(() => navigate('/pembayaran'), 500); 
        } catch (error) {
            if (error.response) {
                setAlert({ type: 'danger', message: error.response.data.message || 'Gagal memperbarui status pembayaran.' });
            } else {
                setAlert({ type: 'danger', message: 'Terjadi kesalahan, coba lagi nanti.' });
            }
        }
    };

    // Tampilkan loading jika data belum dimuat
    if (!pembayaranData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="card shadow-sm">
                <div className="card-header">
                    <h6 className="card-title">Edit Pembayaran</h6>
                </div>
                <div className="card-body fs-8">
                    {/* Tampilkan alert jika ada */}
                    {alert && (
                        <div className={`alert alert-${alert.type}`} role="alert">
                            {alert.message}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nama Penghuni</label>
                            <input
                                type="text"
                                className="form-control"
                                value={pembayaranData.penghuni.nama_lengkap}
                                disabled
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Jenis Pembayaran</label>
                            <input
                                type="text"
                                className="form-control"
                                value={pembayaranData.jenis_pembayaran}
                                disabled
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Status Pembayaran</label>
                            <select
                                className="form-control"
                                name="status_pembayaran"
                                value={formData.status_pembayaran}
                                onChange={handleChange}
                                required
                            >
                                <option value="Lunas">Lunas</option>
                                <option value="Belum Dibayar">Belum Dibayar</option>
                            </select>
                        </div>

                        <div className="d-flex">
                            <button type="submit" className="btn btn-success me-2 fs-8 " disabled={loading}>
                                {loading ? (
                                    <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    'Simpan'
                                )}
                            </button>
                            <button type="button" className="btn btn-secondary fs-8" onClick={() => navigate('/pembayaran')}>Batal</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPembayaran;
