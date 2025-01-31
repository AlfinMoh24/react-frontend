
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Button, Spinner, Alert } from 'react-bootstrap';

const DetailRumah = () => {
    const { id } = useParams(); // Ambil ID rumah dari URL
    const navigate = useNavigate();
    const [rumah, setRumah] = useState(null);
    const [riwayatPenghuni, setRiwayatPenghuni] = useState([]); // Menyimpan riwayat penghuni
    const [loading, setLoading] = useState(true);
    const [loadingButton, setLoadingButton] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleTambahPenghuni = () => {
        navigate(`/rumah/tambah-penghuni/${rumah.id}`);
    };
    const handleEdit = () => {
        navigate(`/rumah/edit-penghuni/${rumah.id}`); // Arahkan ke halaman edit berdasarkan ID penghuni
    };
    const handleEditRumah = () => {
        navigate(`/rumah/edit-rumah/${rumah.id}`); // Arahkan ke halaman edit berdasarkan ID penghuni
    };

    const handleHapusPenghuni = async () => {
        setLoadingButton(true);
        try {
            const response = await axios.delete(
                `http://localhost:8000/api/rumah/${rumah.id}/hapus-penghuni`,
                { id_penghuni: rumah.penghuni.id }
            );
            if (response.data.status) {
                setRumah((prevRumah) => ({
                    ...prevRumah,
                    penghuni: null, // Menghapus penghuni dari rumah
                    status_rumah: 'Tidak Dihuni',
                }));
                setSuccessMessage("Penghuni berhasil dihapus!");
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Terjadi kesalahan saat menghapus penghuni');
            console.error(error);
        } finally {
            setLoading(false); // Set loading ke false setelah selesai
        }
    };
    

    // Ambil data rumah dan riwayat penghuni
    useEffect(() => {
        axios.get(`http://localhost:8000/api/rumah/${id}`)
            .then((response) => {
                if (response.data.status) {
                    setRumah(response.data.data);
                    // Ambil riwayat penghuni
                    return axios.get(`http://localhost:8000/api/riwayat/${id}`);
                } else {
                    setError('Rumah tidak ditemukan');
                }
            })
            .then((response) => {
                if (response) {
                    setRiwayatPenghuni(response.data.data);
                }
            })
            .catch((error) => {
                setError(error.response?.data?.message || 'Terjadi kesalahan');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <Container className="text-center mt-4">
                <Spinner animation="border" />
                <p>Memuat data...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
                <Button variant="secondary" className='fs-8' onClick={() => navigate('/rumah')}>
                    Kembali
                </Button>
            </Container>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h6>Kode Rumah: {rumah.kode_rumah}</h6>
                    <div className='fs-8'>
                        <button className="btn btn-success text-white me-2 fs-9" onClick={() => navigate(`/pembayaran/rumah/${rumah.id}`)}>
                            <i className="fa-solid fa-file-invoice"></i> Rekap Pembayaran
                        </button>
                        <button className="btn btn-primary text-white fs-9" onClick={handleEditRumah}>
                            <i className="fa-solid fa-pen-to-square"></i> Edit Rumah
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <p><strong>Status:</strong> {rumah.status_rumah}</p>
                    <button className="btn btn-secondary fs-8" onClick={() => navigate('/rumah')}>Kembali</button>
                </div>
            </div>

            {rumah.penghuni ? (
                <div className="card mb-3">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h6>Penghuni</h6>
                        <div>
                            <button className="btn btn-warning text-white me-2 fs-9" onClick={handleEdit}>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button className="btn btn-danger text-white fs-9" onClick={handleHapusPenghuni} disabled={loadingButton}>
                                {loadingButton ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> :  <i className="fa-solid fa-trash"></i>}
                            </button>
                        </div>
                    </div>
                    <div className="card-body fs-8">
                        <p><strong>Nama:</strong> {rumah.penghuni.nama_lengkap}</p>
                        <p><strong>Nomor Telepon:</strong> {rumah.penghuni.nomor_telepon}</p>
                        <p><strong>Status Perkawinan:</strong> {rumah.penghuni.status_perkawinan}</p>
                        <p><strong>Status Penghuni:</strong> {rumah.penghuni.status_penghuni}</p>
                        <img src={`http://localhost:8000/storage/${rumah.penghuni.foto_ktp}`} alt="Foto KTP" className="img-fluid" style={{ maxWidth: '200px' }} />
                    </div>
                </div>
            ) : (
                <div className="card mb-3">
                    <div className="card-body text-center">
                        <div className="alert alert-warning fs-8">Rumah ini belum memiliki penghuni.</div>
                        <button className="btn btn-success fs-8" onClick={handleTambahPenghuni}>
                            <i className="fa-solid fa-user-plus me-2"></i> Tambah Penghuni
                        </button>
                    </div>
                </div>
            )}

            {/* Menampilkan Pesan Sukses */}
            {successMessage && (
                <div className="alert alert-danger">{successMessage}</div>
            )}

            <div className="card">
                <div className="card-body">
                    <h6 className="mb-4">Riwayat Penghuni</h6>
                    <table className="table table-striped table-bordered fs-8">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Penghuni</th>
                                <th>Tanggal Masuk - Keluar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {riwayatPenghuni.length > 0 ? (
                                riwayatPenghuni.map((riwayat, index) => {
                                    const riwayatPeriode = riwayat.tanggal_keluar
                                        ? `${new Date(riwayat.tanggal_masuk).toLocaleDateString()} - ${new Date(riwayat.tanggal_keluar).toLocaleDateString()}`
                                        : `${new Date(riwayat.tanggal_masuk).toLocaleDateString()} - Sekarang`;

                                    return (
                                        <tr key={riwayat.id}>
                                            <td>{index + 1}</td>
                                            <td>{riwayat.penghuni.nama_lengkap}</td>
                                            <td>{riwayatPeriode}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">Tidak ada riwayat penghuni</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};

export default DetailRumah;
