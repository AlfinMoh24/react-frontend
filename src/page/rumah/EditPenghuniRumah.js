import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditPenghuniRumah = () => {
    const { id } = useParams(); // Ambil ID rumah dari URL
    const navigate = useNavigate();
    const [rumah, setRumah] = useState(null); // Data rumah
    const [penghuniList, setPenghuniList] = useState([]); // Daftar penghuni yang tersedia
    const [selectedPenghuni, setSelectedPenghuni] = useState(""); // Penghuni yang dipilih
    const [loading, setLoading] = useState(false); // Status loading
    const [error, setError] = useState(""); // Menyimpan pesan error jika ada
    const [success, setSuccess] = useState(""); // Menyimpan pesan sukses jika ada

    // Ambil detail rumah berdasarkan ID
    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/rumah/${id}`)
            .then((res) => {
                setRumah(res.data.data);
                setSelectedPenghuni(res.data.data.id_penghuni || ""); // Set penghuni yang sudah ada
            })
            .catch(() => {
                setError("Gagal memuat data rumah.");
            });
    }, [id]);

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
        setSuccess("");

        // Jika penghuni tidak berubah, jangan lakukan update
        if (rumah?.id_penghuni === selectedPenghuni) {
            setSuccess("Tidak ada perubahan yang dilakukan.");
            setLoading(false);
            return;
        }

        try {
            await axios.put(`http://localhost:8000/api/rumah/${id}/edit-penghuni`, {
                id_penghuni: selectedPenghuni,
            });

            setSuccess("Penghuni berhasil diperbarui!");
            setTimeout(() => navigate(`/rumah/${id}`), 1500); // Redirect setelah 1.5 detik
        } catch (error) {
            setError(error.response?.data?.message || "Gagal memperbarui penghuni.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h6>{rumah ? `Edit Penghuni Rumah ${rumah.kode_rumah}` : "Memuat..."}</h6>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

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

                        <button type="submit" className="btn btn-primary fs-8" disabled={loading}>
                            {loading ? (
                                <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                "Simpan Perubahan"
                            )}
                        </button>

                        <button type="button" className="btn btn-secondary ms-2 fs-8" onClick={() => navigate(`/rumah/${id}`)}>
                            Batal
                        </button>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default EditPenghuniRumah;
