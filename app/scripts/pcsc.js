const pcsclite = require('pcsclite');

let pcsc;

function initializePCSC(mainWindow) {
  pcsc = pcsclite();

  pcsc.on('reader', function (reader) {
    console.log('New reader detected:', reader.name);
    mainWindow.webContents.send('reader-detected', reader.name);


    reader.on('error', function (err) {
      console.log(`Error(${this.name}):`, err.message);
      mainWindow.webContents.send('reader-error', err.message);
    });

    reader.on('status', function (status) {
      const changes = this.state ^ status.state;

      // Card inserted
      if ((changes & this.SCARD_STATE_PRESENT) && (status.state & this.SCARD_STATE_PRESENT)) {
        console.log('Card inserted');

        reader.connect({ share_mode: this.SCARD_SHARE_SHARED }, function (err, protocol) {
          if (err) {
            console.error('Connection error:', err);
            return;
          }

          reader.transmit(Buffer.from([0xFF, 0xCA, 0x00, 0x00, 0x00]), 40, protocol, function (err, data) {
            if (err) {
              console.error('Transmit error:', err);
            } else {
              const uidHex = data.toString('hex').toUpperCase();
              console.log('Card UID:', uidHex);
              mainWindow.webContents.send('card-inserted', uidHex);
            }
            // Stay connected; disconnect explicitly on removal.
          });
        });
      }

      // Card removed
      if ((changes & this.SCARD_STATE_EMPTY) && (status.state & this.SCARD_STATE_EMPTY)) {
        console.log('Card removed');
        mainWindow.webContents.send('card-removed');

        reader.disconnect(reader.SCARD_LEAVE_CARD, function (err) {

          if (err) {
            console.error('Disconnect error:', err);
          } else {
            console.log('Disconnected');
          }
        });
      }
    });

    reader.on('end', function () {
      console.log('Reader', this.name, 'removed');
      mainWindow.webContents.send('reader-removed', this.name);
    });
  });

  pcsc.on('error', function (err) {
    console.error('PCSC Error:', err.message);
    mainWindow.webContents.send('pcsc-error', err.message);
    // Clean-up old pcsc context
    pcsc.close();

    console.log('Attempting to restart PCSC context in 3 seconds...');
    // Restart the context after a short delay to avoid rapid restarts
    setTimeout(() => {
      initializePCSC(mainWindow);
    }, 3000);
  });
}

module.exports = { initializePCSC };