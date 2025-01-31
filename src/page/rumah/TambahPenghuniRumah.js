import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";

const TambahPenghuniRumah = () => {
    const { id } = useParams(); // Ambil ID rumah dari URL
    const navigate = useNavigate();
    const [penghuniList, setPenghuniList] = useState([]); // Daftar penghuni yang tersedia
    const [selectedPenghuni, setSelectedPenghuni] = useState(""); // Penghuni yang dipilih
    const [loading, setLoading] = useState(false); // Status loading
    const [error, setError] = useState(""); // Menyimpan pesan error jika ada
    const [success, setSuccess] = useState(false);

    // Ambil daftar penghuni yang belum menghuni rumah lain
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/penghuni")
            .then((res) => {
                setPenghuniList(res.data.data);
            })
            .catch(() => {
                setError("Gagal memuat daftar penghuni.");
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await axios.post(`http://localhost:8000/api/rumah/${id}/tambah-penghuni`, {
                id_penghuni: selectedPenghuni,
            });

            setSuccess(true); // Tampilkan alert sukses
            setTimeout(() => navigate(`/rumah/${id}`), 1200);
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
                    <div className="card-header">Tambah Penghuni</div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Pilih Penghuni</label>
                                <select
                                    className="form-select"
                                    value={selectedPenghuni}
                                    onChange={(e) => setSelectedPenghuni(e.target.value)}
                                    required
                                >
                                    <option value="">Pilih Penghuni</option>
                                    {penghuniList.map((penghuni) => (
                                        <option key={penghuni.id} value={penghuni.id}>
                                            {penghuni.nama_lengkap}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Tanggal Masuk</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={new Date().toLocaleDateString()}
                                    readOnly
                                />
                            </div>

                            <button type="submit" className="btn btn-primary fs-8" disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : "Tambahkan Penghuni"}
                            </button>

                            <button type="button" className="btn btn-secondary ms-2 fs-8" onClick={() => navigate(`/rumah/${id}`)}>
                                Kembali
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TambahPenghuniRumah;
