import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import moment from 'moment';

export async function generarPDF(data) {
  const asset = Asset.fromModule(require('../assets/logo.png'));
  await asset.downloadAsync();

  const logoBase64 = await FileSystem.readAsStringAsync(asset.localUri || '', {
    encoding: FileSystem.EncodingType.Base64,
  });

  const fecha = moment().format('LLL');

  const html = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            padding: 24px;
            color: #333333;
            background-color: #FFFFFF;
          }

          .logo {
            text-align: center;
            margin-bottom: 20px;
          }

          img {
            width: 200px;
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

          tr:hover {
            background-color: #E6E6E6;
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

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri);
  } else {
    alert('PDF generado en: ' + uri);
  }

  return uri;
}
