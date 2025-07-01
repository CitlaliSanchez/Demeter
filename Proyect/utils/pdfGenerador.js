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
  try {
    photoBase64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } catch (e) {
    console.warn('No se pudo leer la imagen para el PDF:', e.message);
    photoBase64 = '';
  }
}

  const fecha = moment().format('LLL');

  const html = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            padding: 24px;
            color: #333;
            background-color: #FAF9F5;
          }

          .logo, .photo {
            text-align: center;
            margin-bottom: 20px;
          }

          .photo img {
            width: 90%;
            border: 4px solid #A3C585;
            border-radius: 12px;
          }

          h1 {
            color: #66A649;
            text-align: center;
            margin-bottom: 10px;
          }

          .date {
            text-align: center;
            color: #888;
            margin-bottom: 24px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          }

          th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: center;
          }

          th {
            background-color: #547326;
            color: #FFFFFF;
          }

          tr:nth-child(even) {
            background-color: #F2CDA0;
          }

          .footer {
            text-align: center;
            font-size: 12px;
            margin-top: 30px;
            color: #495948;
          }
        </style>
      </head>
      <body>
        <div class="logo">
          <img src="data:image/png;base64,${logoBase64}" />
        </div>
        <h1>Reporte Detallado - Demeter</h1>
        <div class="date">Generado: ${fecha}</div>

        ${
          photoBase64
            ? `<div class="photo"><img src="data:image/jpeg;base64,${photoBase64}" /></div>`
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
            ${data
              .map(
                (item) => `
              <tr>
                <td>${item.date}</td>
                <td>${item.ph}</td>
                <td>${item.ec}</td>
                <td>${item.temp}</td>
                <td>${item.nivel}</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
        <div class="footer">Demeter • La Magia del Cultivo</div>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });

  return uri;
}