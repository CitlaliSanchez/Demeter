// utils/pdfGenerador.js
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import moment from 'moment';

export async function generarPDF(data, imageUri) {
  const logoAsset = Asset.fromModule(require('../assets/logo.png'));
  await logoAsset.downloadAsync();

  const logoBase64 = await FileSystem.readAsStringAsync(logoAsset.localUri || '', {
    encoding: FileSystem.EncodingType.Base64,
  });

  let photoBase64 = '';
  if (imageUri) {
    photoBase64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }

  const fecha = moment().format('LLL');

  const html = `
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
          body {
            font-family: 'Poppins', sans-serif;
            padding: 20px;
            font-size: 10px;
            background-color: #fff;
            color: #333;
          }
          .center {
            text-align: center;
            margin-bottom: 10px;
          }
          .logo {
            width: 120px;
            margin-bottom: 10px;
          }
          .photo {
            width: 90%;
            border: 2px solid #A3C585;
            border-radius: 10px;
            margin: 10px auto;
            display: block;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #aaa;
            padding: 5px;
            text-align: center;
          }
          th {
            background-color: #547326;
            color: white;
          }
          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          .footer {
            margin-top: 16px;
            text-align: center;
            font-size: 9px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="center">
          <img src="data:image/png;base64,${logoBase64}" class="logo" />
          <h2>Reporte de Cultivo - Área A</h2>
          <p>Generado: ${fecha}</p>
        </div>
        ${
          photoBase64
            ? `<img src="data:image/jpeg;base64,${photoBase64}" class="photo" />`
            : ''
        }
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>pH</th>
              <th>EC</th>
              <th>Temp (°C)</th>
              <th>Nivel</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                <td>${item.date}</td>
                <td>${item.ph}</td>
                <td>${item.ec}</td>
                <td>${item.temp}</td>
                <td>${item.nivel}</td>
              </tr>`).join('')}
          </tbody>
        </table>
        <div class="footer">Demeter • La Magia del Cultivo</div>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });
  console.log('PDF generado en:', uri);
  return uri;
}
