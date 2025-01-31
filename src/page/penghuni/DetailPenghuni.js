import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PenghuniDetail = () => {
  const { id } = useParams(); // Ambil ID dari URL
  const [penghuni, setPenghuni] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/penghuni/${id}`) // Sesuaikan dengan endpoint API
      .then((response) => {
        if (response.data.status) {
          setPenghuni(response.data.data); // Ambil data dari response.data.data
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Terjadi kesalahan:", error);
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

  if (!penghuni) {
    return <div className="text-center text-danger">Penghuni tidak ditemukan</div>;
  }

  return (
    <div className="container mt-4 fs-8">
      <h4>Detail Penghuni</h4>
      <div className="table-detail-penghuni bg-white p-4 shadow-sm rounded-1">
        <table >
          <tbody>
            <tr>
              <th>Nama Lengkap</th>
              <td>{penghuni.nama_lengkap}</td>
            </tr>
            <tr>
              <th>Nomor Telepon</th>
              <td>{penghuni.nomor_telepon}</td>
            </tr>
            <tr>
              <th>Status Perkawinan</th>
              <td>{penghuni.status_perkawinan}</td>
            </tr>
            <tr>
              <th>Status Penghuni</th>
              <td>{penghuni.status_penghuni}</td>
            </tr>
            <tr>
              <th>Foto KTP</th>
              <td>
                {penghuni.foto_ktp ? (
                  <img src={`http://localhost:8000/storage/${penghuni.foto_ktp}`} alt="Foto KTP" width="150" />
                ) : (
                  "Tidak tersedia"
                )}
              </td>
            </tr>
            <tr>
              <th>Terdaftar Sejak</th>
              <td>{new Date(penghuni.created_at).toLocaleDateString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PenghuniDetail;
