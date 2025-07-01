import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import moment from 'moment';
import { colors, fonts, fontSizes } from '../assets/styles/theme';

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
          @page {
            size: A4;
            margin: 20px;
          }

          body {
            font-family: 'Arial', sans-serif;
            padding: 10px;
            font-size: 12px;
            color: #333;
            background-color: #fff;
          }

          .logo, .photo {
            text-align: center;
            margin-bottom: 10px;
          }

          img.logo-img {
            width: 150px;
          }

          img.cultivo-img {
            width: 90%;
            max-height: 250px;
            object-fit: cover;
            border: 2px solid #A3C585;
            border-radius: 8px;
          }

          h1 {
            font-size: 16px;
            color: #66A649;
            text-align: center;
            margin-bottom: 5px;
          }

          .date {
            text-align: center;
            font-size: 11px;
            color: #888;
            margin-bottom: 10px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }

          th, td {
            border: 1px solid #ccc;
            padding: 6px;
            text-align: center;
          }

          th {
            background-color: #547326;
            color: #FFFFFF;
          }

          tr:nth-child(even) {
            background-color: #E0E0E0;
          }

          .footer {
            text-align: center;
            font-size: 10px;
            margin-top: 20px;
            color: #495948;
          }
        </style>
      </head>
      <body>
        <div class="logo">
          <img class="logo-img" src="data:image/png;base64,${logoBase64}" />
        </div>
        <h1>Reporte Detallado - Demeter</h1>
        <div class="date">Generado: ${fecha}</div>

        ${
          photoBase64
            ? `<div class="photo"><img class="cultivo-img" src="data:image/jpeg;base64,${photoBase64}" /></div>`
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