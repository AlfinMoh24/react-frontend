import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TambahPembayaran = () => {
    const navigate = useNavigate();
    const [penghuniData, setPenghuniData] = useState([]);
    const [formData, setFormData] = useState({
        id_penghuni: '',
        id_rumah:'',
        jenis_pembayaran: 'Satpam',
        periode_pembayaran: 'Bulanan',
        jumlah: 100000, 
        status_pembayaran: 'Belum Dibayar',
        tanggal: new Date().toISOString().split('T')[0] 
    });
    const [alert, setAlert] = useState({ message: '', type: '' }); 
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        axios.get('http://localhost:8000/api/penghuni')
            .then(response => setPenghuniData(response.data.data))
            .catch(error => console.error("Error fetching penghuni data", error));
    }, []);

    // Hitung jumlah otomatis
    useEffect(() => {
        let jumlah = 0;
        if (formData.jenis_pembayaran === "Satpam") {
            jumlah = 100000;
        } else if (formData.jenis_pembayaran === "Kebersihan") {
            jumlah = 15000;
        }

        // Jika periode tahunan, jumlah dikali 12
        if (formData.periode_pembayaran === "Tahunan") {
            jumlah *= 12;
        }

        setFormData(prevState => ({ ...prevState, jumlah }));
    }, [formData.jenis_pembayaran, formData.periode_pembayaran]);

    // Handle form input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Mulai loading
        try {
            await axios.post('http://localhost:8000/api/pembayaran', formData);
            setAlert({ message: 'Pembayaran berhasil ditambahkan!', type: 'success' });
            setTimeout(() => navigate('/pembayaran'), 2000); 
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Gagal menambahkan pembayaran. Periksa kembali input.';
            setAlert({ message: errorMessage, type: 'danger' });
            console.error("Error submitting pembayaran", error);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Tambah Pembayaran</h5>
                </div>
                <div className="card-body fs-8">
                    {/* Menampilkan alert jika ada */}
                    {alert.message && (
                        <div className={`alert alert-${alert.type}`} role="alert">
                            {alert.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 ">
                            <label className="form-label">Nama Penghuni</label>
                            <select
                                className="form-control"
                                name="id_penghuni"
                                value={formData.id_penghuni}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Pilih Penghuni</option>
                                {(penghuniData || []).map(penghuni => (
                                    <option key={penghuni.id} value={penghuni.id}>
                                        {penghuni.nama_lengkap}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Jenis Pembayaran</label>
                            <select
                                className="form-control"
                                name="jenis_pembayaran"
                                value={formData.jenis_pembayaran}
                                onChange={handleChange}
                                required
                            >
                                <option value="Satpam">Satpam</option>
                                <option value="Kebersihan">Kebersihan</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Periode Pembayaran</label>
                            <select
                                className="form-control"
                                name="periode_pembayaran"
                                value={formData.periode_pembayaran}
                                onChange={handleChange}
                                required
                            >
                                <option value="Bulanan">Bulanan</option>
                                <option value="Tahunan">Tahunan</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Jumlah</label>
                            <input
                                type="number"
                                className="form-control"
                                name="jumlah"
                                value={formData.jumlah}
                                readOnly
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

                        <div className="mb-3">
                            <label className="form-label">Tanggal</label>
                            <input
                                type="date"
                                className="form-control"
                                name="tanggal"
                                value={formData.tanggal}
                                onChange={handleChange}
                                required
                                disabled
                            />
                        </div>

                        <div className="alert alert-info fs-9">
                            <strong>Total yang harus dibayar: </strong> Rp {formData.jumlah.toLocaleString()}
                        </div>

                        <div className="d-flex">
                            <button type="submit" className="btn btn-success me-2 fs-8" disabled={loading}>
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

export default TambahPembayaran;
