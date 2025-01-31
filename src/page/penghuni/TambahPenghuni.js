import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TambahPenghuni = () => {
    const [namaLengkap, setNamaLengkap] = useState('');
    const [nomorTelepon, setNomorTelepon] = useState('');
    const [statusPerkawinan, setStatusPerkawinan] = useState('Belum Menikah');
    const [statusPenghuni, setStatusPenghuni] = useState('Kontrak');
    const [fotoKTP, setFotoKTP] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFotoKTP(e.target.files[0]);
    };

    const validateForm = () => {
        // Validasi nama lengkap
        if (!namaLengkap) {
            setError('Nama lengkap harus diisi');
            return false;
        }

        // Validasi nomor telepon
        const phoneRegex = /^08[1-9][0-9]{8,10}$/;
        if (!phoneRegex.test(nomorTelepon)) {
            setError('Nomor telepon tidak valid');
            return false;
        }

        // Validasi foto KTP (harus file gambar dan ukuran maksimal 5MB)
        if (fotoKTP) {
            if (!fotoKTP.type.startsWith('image/')) {
                setError('Hanya file gambar yang diizinkan untuk foto KTP');
                return false;
            }
            if (fotoKTP.size > 1900000) { // Batas ukuran 2MB
                setError('Ukuran file terlalu besar. Maksimal 2MB.');
                return false;
            }
        }

        // Jika tidak ada kesalahan, reset error dan lanjutkan
        setError(null);
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Hentikan jika validasi gagal
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('nama_lengkap', namaLengkap);
        formData.append('nomor_telepon', nomorTelepon);
        formData.append('status_perkawinan', statusPerkawinan);
        formData.append('status_penghuni', statusPenghuni);
        if (fotoKTP) {
            formData.append('foto_ktp', fotoKTP);
        }

        try {
            await axios.post('http://localhost:8000/api/penghuni', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setLoading(false);
            setSuccess(true); // Tampilkan alert sukses
            setTimeout(() => navigate('/penghuni'), 500);
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Terjadi kesalahan');
        }
    };

    return (
        <div>
            <h4 className="my-3">Tambah Penghuni</h4>

            {error && <div className="alert alert-danger fs-9 py-3">{error}</div>}
            {success && <div className="alert alert-success fs-9 py-3">Penghuni berhasil ditambahkan!</div>}

            <div className="mt-4 fs-8">
                <div className="card">
                    <div className="card-header">Edit Penghuni</div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">

                            <div className="mb-3">
                                <label className="form-label">Nama Lengkap</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={namaLengkap}
                                    onChange={(e) => setNamaLengkap(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Nomor Telepon</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={nomorTelepon}
                                    onChange={(e) => setNomorTelepon(e.target.value)}
                                    required
                                    placeholder="08XXXXXXXX"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Status Perkawinan</label>
                                <select
                                    className="form-select"
                                    value={statusPerkawinan}
                                    onChange={(e) => setStatusPerkawinan(e.target.value)}
                                >
                                    <option value="Belum Menikah">Belum Menikah</option>
                                    <option value="Menikah">Menikah</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Status Penghuni</label>
                                <select
                                    className="form-select"
                                    value={statusPenghuni}
                                    onChange={(e) => setStatusPenghuni(e.target.value)}
                                >
                                    <option value="Kontrak">Kontrak</option>
                                    <option value="Tetap">Tetap</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Foto KTP</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary fs-8" disabled={loading}>
                                {loading ? "Menyimpan..." : "Simpan"}
                            </button>

                            <button type="button" className="btn btn-secondary ms-2 fs-8" onClick={() => navigate('/penghuni')}>
                                Kembali
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default TambahPenghuni;
