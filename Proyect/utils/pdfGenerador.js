import * as FileSystem from 'expo-file-system';
import moment from 'moment';
import * as Print from 'expo-print';
import { Asset } from 'expo-asset';

export async function generarPDF(data, imageUri, observaciones = '', userEmail = '', area = 'Área') {
  // Carga logo y lo convierte a base64
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
            padding: 30px;
            background-color: #fff;
            font-size: 11px;
            color: #333;
          }
          .center {
            text-align: center;
            margin-bottom: 24px;
          }
          .logo {
            width: 140px;
            margin-bottom: 10px;
          }
          h2 {
            margin: 4px 0 10px 0;
            font-size: 20px;
            color: #547326;
          }
          .meta {
            font-size: 10px;
            color: #888;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #aaa;
            padding: 6px;
            text-align: center;
          }
          th {
            background-color: #547326;
            color: white;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .photo {
            width: 45%;
            border: 3px solid #8C5F37;
            border-radius: 12px;
            margin-top: 25px;
            display: block;
            margin-left: auto;
            margin-right: auto;
          }
          .obs {
            margin-top: 24px;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 10px;
            background-color: #f8f8f8;
          }
          .footer {
            text-align: center;
            font-size: 9px;
            margin-top: 30px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="center">
          <img src="data:image/png;base64,${logoBase64}" class="logo" />
          <h2>Crop Report – ${area}</h2>
          <p class="meta">Generated on: ${fecha}</p>
        </div>

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

        ${photoBase64
          ? `<img src="data:image/jpeg;base64,${photoBase64}" class="photo" />`
          : ''}

        <div class="obs">
          <h4>Farmer's observations:</h4>
          <p>${observaciones || 'Sin observaciones registradas.'}</p>
        </div>

        <div class="footer">
          Redactado por: ${userEmail || 'Usuario desconocido'} <br />
          Demeter • The Magic of Smart Growing
        </div>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });
  return uri;
}
