import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TambahPengeluaran = () => {
    const navigate = useNavigate();
    const [deskripsi, setdeskripsi] = useState('');
    const [jumlah, setJumlah] = useState('');
    const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // 🔹 Tambahkan state loading

    // Fungsi untuk menangani submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!deskripsi || !jumlah || !tanggal) {
            setMessage("Semua field harus diisi!");
            return;
        }

        setLoading(true); // 🔹 Aktifkan loading sebelum request

        try {
            const response = await axios.post('http://localhost:8000/api/pengeluaran', {
                deskripsi: deskripsi,
                jumlah: parseFloat(jumlah),
                tanggal: tanggal,
            });

            if (response.data.status) {
                setMessage("Pengeluaran berhasil ditambahkan!");
                setTimeout(() => {
                    navigate('/Pengeluaran');
                }, 2000);
            } else {
                setMessage(response.data.message || "Terjadi kesalahan.");
            }
        } catch (error) {
            setMessage("Terjadi kesalahan pada server.");
            console.error("Error submitting form:", error);
        }

        setLoading(false); // 🔹 Matikan loading setelah request selesai
    };

    return (
        <div className="container mt-4">
            <h4 className="mb-4 text-center">Tambah Pengeluaran</h4>

            {message && (
                <div className="alert alert-info">{message}</div>
            )}

            <div className="card shadow-sm">
                <div className="card-header">
                    <h6 className="card-title mb-0">Form Pengeluaran</h6>
                </div>
                <div className="card-body fs-8">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="deskripsi">Jenis Pengeluaran</label>
                            <input
                                type="text"
                                className="form-control"
                                id="deskripsi"
                                value={deskripsi}
                                onChange={(e) => setdeskripsi(e.target.value)}
                                placeholder="Masukkan jenis Pengeluaran"
                            />
                        </div>

                        <div className="form-group mt-3">
                            <label htmlFor="jumlah">Jumlah</label>
                            <input
                                type="number"
                                className="form-control"
                                id="jumlah"
                                value={jumlah}
                                onChange={(e) => setJumlah(e.target.value)}
                                placeholder="Masukkan jumlah Pengeluaran"
                            />
                        </div>

                        <div className="form-group mt-3">
                            <label htmlFor="tanggal">Tanggal</label>
                            <input
                                type="date"
                                className="form-control"
                                id="tanggal"
                                value={tanggal}
                                onChange={(e) => setTanggal(e.target.value)}
                            />
                        </div>

                        {/* 🔹 Tombol dengan Spinner */}
                        <button type="submit" className="btn btn-primary mt-3 fs-8" disabled={loading}>
                            {loading ? (
                                <span>
                                    <i className="fa fa-spinner fa-spin me-2"></i> Menyimpan...
                                </span>
                            ) : (
                                "Simpan"
                            )}
                        </button>
                        <button type="button" className="btn btn-secondary mt-3 ms-2 fs-8" onClick={() => navigate('/pengeluaran')}>Batal</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TambahPengeluaran;
