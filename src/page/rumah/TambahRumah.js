import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form } from 'react-bootstrap';

const TambahRumah = () => {
    const [kode_rumah, setKodeRumah] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);


    const validateForm = () => {
        // Validasi nama lengkap
        if (!kode_rumah) {
            setError('harus diisi');
            return false;
        }

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
        formData.append('kode_rumah', kode_rumah);

        try {
            await axios.post('http://localhost:8000/api/rumah', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccess(true);
            setLoading(false);
            setTimeout(() => navigate('/rumah'), 1200);
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Terjadi kesalahan');
        }
    };

    return (
        <div>
            <h4 className="my-3">Tambah Rumah</h4>

            {error && <div className="alert alert-danger fs-9 py-3">{error}</div>}
            {success && <div className="alert alert-success fs-9 py-3">Rumah berhasil ditambahkan!</div>}

            <div className="mt-4 fs-8">
                <div className="card">
                    <div className="card-header">Tambah Rumah</div>
                    <div className="card-body">

                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <Form.Group className="mb-3">
                                <Form.Label>Kode Rumah</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={kode_rumah}
                                    onChange={(e) => setKodeRumah(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <button className="btn btn-primary fs-8" type="submit" disabled={loading}>
                                {loading ? 'Menyimpan...' : 'Simpan'}
                            </button>
                            <button className="btn btn-secondary ms-2 fs-8" onClick={() => navigate('/rumah')}>
    Kembali
</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TambahRumah;
