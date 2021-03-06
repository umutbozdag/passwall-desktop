<template>
  <div id="app">
    <RouterView />
    <TheIcons />
    <notifications width="345" position="top center" />
  </div>
</template>

<script>
import fs from 'fs'
import Papa from 'papaparse'
import { ipcRenderer } from 'electron'
const { dialog } = require('electron').remote
import { mapActions, mapState } from 'vuex'
import CryptoUtils from '@/utils/crypto'

export default {
  created() {
    ipcRenderer.on('export', this.onExport)
    ipcRenderer.on('import', this.onImport)
  },

  computed: {
    ...mapState(['access_token'])
  },

  methods: {
    ...mapActions(['Import', 'Export']),
    ...mapActions('Logins', ['FetchAll']),

    checkAccess() {
      if (!this.access_token) {
        this.$notifyError(this.$t('You are not logged in. Please log in and try again'))
      }
      return Boolean(this.access_token)
    },

    async onExport() {
      if (!this.checkAccess()) return

      const filePath = dialog.showSaveDialogSync(null)
      if (!filePath) return

      try {
        const data = await this.Export()

        const itemList = JSON.parse(CryptoUtils.aesDecrypt(data))
        itemList.forEach(item => CryptoUtils.decryptFields(item))

        const csvContent = Papa.unparse(itemList)
        fs.writeFileSync(filePath, csvContent)
      } catch (error) {
        console.log(error)
      }
    },

    onImport() {
      if (!this.checkAccess()) return

      dialog.showOpenDialog({ properties: ['openFile'] }, async files => {
        if (files.length === 0) return

        try {
          const fileContent = fs.readFileSync(files[0]).toString()

          let parsedCSV = Papa.parse(fileContent.trim(), {
            header: true // creates array of { head: value }
          })

          if (parsedCSV.errors.length > 0) {
            this.$notifyError(this.$t('There is an error. Error: ', parsedCSV.errors[0].message))
            return
          }

          const itemList = parsedCSV.data.map(item => {
            return CryptoUtils.encryptPayload(item, ['username', 'password', 'extra'])
          })

          await this.Import(itemList)
          this.FetchAll()
        } catch (error) {
          console.log(error)
        }
      })
    },

    parseCSV(csv) {
      const arr = []
      let lines = csv.split('\n')

      // Get headers like ["URL", "Username", "Password"]
      let headers = lines[0].split(',')

      for (let i = 1; i < lines.length; i++) {
        let obj = {}

        if (!lines[i] || !lines[i].trim()) continue

        const words = lines[i].split(',')

        words.forEach((word, j) => {
          obj[headers[j].trim()] = words[j]
        })

        arr.push(obj)
      }
      return arr
    }
  }
}
</script>
