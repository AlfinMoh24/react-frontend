import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";

const EditPenghuni = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [penghuni, setPenghuni] = useState({
        nama_lengkap: "",
        nomor_telepon: "",
        status_perkawinan: "Belum Menikah",
        status_penghuni: "Kontrak",
        foto_ktp: null,
    });

    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:8000/api/penghuni/${id}`)
            .then((res) => {
                setPenghuni(res.data.data);
                setPreview(`http://localhost:8000/storage/${res.data.data.foto_ktp}`);
            })
            .catch((err) => console.error(err));
    }, [id]);

    const validate = () => {
        let newErrors = {};

        // Validasi Nama Lengkap
        if (!penghuni.nama_lengkap.trim()) {
            newErrors.nama_lengkap = "Nama lengkap wajib diisi.";
        } else if (penghuni.nama_lengkap.length < 3) {
            newErrors.nama_lengkap = "Nama lengkap minimal 3 karakter.";
        }

        // Validasi Nomor Telepon
        const phonePattern = /^08[1-9][0-9]{8,10}$/;
        if (!penghuni.nomor_telepon.trim()) {
            newErrors.nomor_telepon = "Nomor telepon wajib diisi.";
        } else if (!phonePattern.test(penghuni.nomor_telepon)) {
            newErrors.nomor_telepon = "Format nomor telepon tidak valid.";
        }

        // Validasi Foto KTP
        if (penghuni.foto_ktp instanceof File) {
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (!allowedTypes.includes(penghuni.foto_ktp.type)) {
                newErrors.foto_ktp = "Format gambar harus JPG, JPEG, atau PNG.";
            }
            if (penghuni.foto_ktp.size > 2 * 1024 * 1024) {
                newErrors.foto_ktp = "Ukuran gambar maksimal 2MB.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setPenghuni({ ...penghuni, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPenghuni({ ...penghuni, foto_ktp: file });

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;
        setLoading(true);

        const formData = new FormData();
        formData.append("nama_lengkap", penghuni.nama_lengkap);
        formData.append("nomor_telepon", penghuni.nomor_telepon);
        formData.append("status_perkawinan", penghuni.status_perkawinan);
        formData.append("status_penghuni", penghuni.status_penghuni);

        if (penghuni.foto_ktp instanceof File) {
            formData.append("foto_ktp", penghuni.foto_ktp);
        }

        try {
            await axios.post(`http://localhost:8000/api/penghuni/${id}?_method=PUT`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setLoading(false);
            setSuccess(true);
            setTimeout(() => navigate('/penghuni'), 2200);
        } catch (err) {
            console.error(err);
            setLoading(false);
            setError(err.response?.data?.message || 'Terjadi kesalahan');
        }
    };

    return (
        <div className="container mt-4 fs-8">
            {error && <div className="alert alert-danger fs-9 py-3">{error}</div>}
            {success && <div className="alert alert-success fs-9 py-3">Penghuni berhasil diubah!</div>}
            <div className="card">
                <div className="card-header">Edit Penghuni</div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label className="form-label">Nama Lengkap</label>
                            <input
                                type="text"
                                className={`form-control  ${errors.nama_lengkap ? "is-invalid" : ""} `}
                                name="nama_lengkap"
                                value={penghuni.nama_lengkap}
                                onChange={handleChange}
                            />
                            <div className="invalid-feedback">{errors.nama_lengkap}</div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Nomor Telepon</label>
                            <input
                                type="text"
                                className={`form-control ${errors.nomor_telepon ? "is-invalid" : ""}`}
                                name="nomor_telepon"
                                value={penghuni.nomor_telepon}
                                onChange={handleChange}
                            />
                            <div className="invalid-feedback">{errors.nomor_telepon}</div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Status Perkawinan</label>
                            <select
                                className="form-select"
                                name="status_perkawinan"
                                value={penghuni.status_perkawinan}
                                onChange={handleChange}
                            >
                                <option value="Belum Menikah">Belum Menikah</option>
                                <option value="Menikah">Menikah</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Status Penghuni</label>
                            <select
                                className="form-select"
                                name="status_penghuni"
                                value={penghuni.status_penghuni}
                                onChange={handleChange}
                            >
                                <option value="Kontrak">Kontrak</option>
                                <option value="Tetap">Tetap</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Foto KTP</label>
                            <input
                                type="file"
                                className={`form-control ${errors.foto_ktp ? "is-invalid" : ""}`}
                                onChange={handleFileChange}
                            />
                            <div className="invalid-feedback">{errors.foto_ktp}</div>
                            {preview && (
                                <div className="mt-2">
                                    <img src={preview} alt="Preview KTP" width="200px" />
                                </div>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary fs-8" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Simpan Perubahan'}
                        </button>
                        <button className="btn btn-secondary ms-2 fs-8" onClick={() => navigate('/penghuni')}>
                            Kembali
                        </button>


                    </form>
                </div>
            </div>
        </div>

    );
};

export default EditPenghuni;
