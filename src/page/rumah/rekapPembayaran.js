import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const RekapPembayaran = () => {
    const { id } = useParams(); // Mengambil ID rumah dari parameter URL
    const navigate = useNavigate();
    const [pembayaranData, setPembayaranData] = useState([]);
    const [rumahDetail, setRumahDetail] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Ambil data pembayaran berdasarkan rumah
    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:8000/api/pembayaran/rumah/${id}`)
            .then(response => {
                setPembayaranData(response.data.data);
                setLoading(false);
            })
            .catch(error => {
                setError("Gagal mengambil data pembayaran.");
                setLoading(false);
            });
    }, [id]);
    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:8000/api/rumah/${id}`)
            .then(response => {
                setRumahDetail(response.data.data.penghuni);
                setLoading(false);
            })
            .catch(error => {
                setError("Gagal mengambil detail rumah.");
                setLoading(false);
            });
    }, [id]);
    if (loading) {
        return (
          <div className="text-center mt-4 container">
            <div className="spinner-border"></div>
            <p>Memuat data...</p>
          </div>
        );
      }
    return (
        <div className="container mt-4">
            <h4 className="mb-4 text-center">Rekap Pembayaran</h4>

            {/* Tampilkan error jika ada */}
            {error && <div className="alert alert-danger">tidak ada rekap pembayaran pada rumah ini</div>}

            {/* Tampilkan detail rumah */}
            <div className="card shadow-sm mb-4">
                <div className="card-header">
                    <h6 className="card-title mb-0">Detail Rumah</h6>
                </div>
                <div className="card-body fs-8">
                    {rumahDetail ? (
                        <>
                            <p><strong>Penghuni Sekarang:</strong> {rumahDetail.nama_lengkap}</p>
                            <p><strong>Status:</strong> {rumahDetail.status_penghuni}</p>
                        </>
                    ) : (
                        <p className="text-muted">Rumah ini belum dihuni.</p>
                    )}
                </div>
            </div>

            {/* Tabel Riwayat Pembayaran */}
            <div className="card shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="card-title mb-0">Riwayat Pembayaran</h6>
                    <button className="btn btn-secondary fs-9" onClick={() => navigate('/rumah')}>Kembali</button>
                </div>
                <div className="card-body fs-8">
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Penghuni</th>
                                    <th>Tanggal</th>
                                    <th>Jenis Pembayaran</th>
                                    <th>Jumlah</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pembayaranData.length > 0 ? (
                                    pembayaranData.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.penghuni.nama_lengkap}</td>
                                            <td>{item.tanggal}</td>
                                            <td>{item.jenis_pembayaran}</td>
                                            <td>Rp {item.jumlah.toLocaleString('id-ID')}</td>
                                            <td>
                                                <span className={`badge ${item.status_pembayaran === 'Lunas' ? 'bg-success' : 'bg-warning'}`}>
                                                    {item.status_pembayaran}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">Belum ada pembayaran.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RekapPembayaran;
