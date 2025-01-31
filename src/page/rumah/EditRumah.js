import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditRumah = () => {
    const { id } = useParams(); // Ambil ID rumah dari URL
    const navigate = useNavigate();
    const [rumah, setRumah] = useState({
        kode_rumah: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Ambil data rumah berdasarkan ID
    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/rumah/${id}`)
            .then((res) => {
                setRumah(res.data.data);
            })
            .catch(() => {
                setError("Gagal memuat data rumah.");
            });
    }, [id]);

    // Handle perubahan input
    const handleChange = (e) => {
        setRumah({ ...rumah, [e.target.name]: e.target.value });
    };

    // Handle submit edit rumah
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await axios.put(`http://localhost:8000/api/rumah/${id}`, rumah);
            setSuccess("Rumah berhasil diperbarui!");
            setTimeout(() => navigate(`/rumah/${id}`), 500); // Redirect setelah 2 detik
        } catch (error) {
            setError("Kode Rumah Sudah digunakan.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div>
            <h4 className="my-3">Edit Rumah</h4>

            {error && <div className="alert alert-danger fs-9 py-3">{error}</div>}
            {success && <div className="alert alert-success fs-9 py-3">Rumah berhasil di ubah!</div>}

            <div className="mt-4 fs-8">
                <div className="card">
                    <div className="card-header">Edit Rumah</div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Kode Rumah</label>
                                <input
                                    type="text"
                                    name="kode_rumah"
                                    value={rumah.kode_rumah}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary fs-8" disabled={loading}>
                                {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "Simpan Perubahan"}
                            </button>
                            <button type="button" className="btn btn-secondary ms-2 fs-8" onClick={() => navigate(`/rumah/${id}`)}>
                                Batal
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default EditRumah;
