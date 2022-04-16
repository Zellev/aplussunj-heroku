 /* eslint-disable */
const { format } = require('date-fns');
const { Op } = require('sequelize');
const createError = require('../errorHandlers/ApiErrors');

const alphanum = /^[a-zA-Z0-9\s]+$/;
const rolesKeywords = [ 'admin', 'dosen', 'mahasiswa' ];
const aktifkeywords = [ 'aktif', 'berlaku', 'berjalan', 'berlangsung' ];
const nonaktifkeywords = [ 
  'tidak', 'non', 'non aktif', 'tidak berlaku', 'tidak berjalan', 
  'tidak berlangsung'
];
const statusSoalKeywords = [ 'draft', 'terbit' ];

module.exports = {

  userValidator(find){
    let filtered = find.toLowerCase(), searchObj;
    const id = /^[1-9]\d{0,}$/.test(find);
    if(id){
      searchObj = [
        {id: {[Op.eq]: find}}
      ]
    } else if(
      aktifkeywords.some(v => find.includes(v)) ||
      nonaktifkeywords.some(v => find.includes(v))
      ) {
      if(filtered === 'tidak aktif') filtered = 'tidak_aktif';
      searchObj = [
        {status_civitas: {[Op.eq]: filtered }},
      ]
    } else if(rolesKeywords.some(v => find.includes(v))) {
      searchObj = [
        {'$Role.role$': {[Op.eq]: filtered }}
      ]
    } else if(alphanum.test(find)) {
      searchObj = [        
        {username: {[Op.like]:'%' + find + '%'}},
        {email: {[Op.like]:'%' + find + '%'}}
      ]
    } else {
      searchObj = createError.BadRequest('Invalid search query');
    }
    return searchObj;
  },

  dosenValidator(find){
    let filtered, searchObj;
    if(alphanum.test(find)) {
      filtered = find.toLowerCase()
      searchObj =  [
        {nama_lengkap: {[Op.like]:'%' + find + '%'}},
        {NIDN: {[Op.like]:'%' + find + '%'}},
        {NIDK: {[Op.like]:'%' + find + '%'}}
      ]
    } else {
      searchObj = createError.BadRequest('Invalid search query');
    }
    return searchObj;
  },

  mahasiswaValidator(find){
    let filtered, searchObj;
    if(alphanum.test(find)) {
      filtered = find.toLowerCase()
      searchObj =  [
        {nama_lengkap: {[Op.like]:'%' + find + '%'}},
        {NIM: {[Op.like]:'%' + find + '%'}}
      ]
    } else {
      searchObj = createError.BadRequest('Invalid search query');
    }
    return searchObj;
  },

  matkulValidator(find) {
    let filtered, searchObj;
    const id = /^[1-9]\d{0,}$/.test(find);
    if(id){
      searchObj = [
        {id_matkul: {[Op.eq]: find}}
      ]
    } else if(alphanum.test(find)) {
      filtered = find.toLowerCase()
      searchObj = [        
        {kode_matkul: {[Op.like]:'%' + find + '%'}},
        {nama_matkul: {[Op.like]:'%' + find + '%'}}
      ]
    } else {
      searchObj = createError.BadRequest('Invalid search query');
    }
    return searchObj;
  },

  kelasValidator(find) {
    let filtered, searchObj;
    const id = /^[1-9]\d{0,}$/.test(find);
    if(id){
      searchObj = [
        {id_kelas: {[Op.eq]: find}}
      ]
    } else if(alphanum.test(find)) {
      filtered = find.toLowerCase()
      searchObj = [
        {kode_seksi: {[Op.like]:'%' + find + '%'}},
        {'$Matkul.nama_matkul$': {[Op.like]:'%' + find + '%'}},
        {'$Dosens.nama_lengkap$': {[Op.like]:'%' + find + '%'}},
        {'$RefSem.semester$': {[Op.like]:'%' + find + '%'}}  
      ]
    } else {
      searchObj = createError.BadRequest('Invalid search query');
    }
    return searchObj;
  },

  ujianValidator(find) {
  let filtered, searchObj;
  const dateRegex = /([0-2][0-9]|(3)[0-1])(\-|\/)(((0)[0-9])|((1)[0-2]))(\-|\/)\d{4}/.test(find);
  const id = /^[1-9]\d{0,2}(?:\,\d{1,3})?$/.test(find);
    if (aktifkeywords.some(v => find.includes(v))) {        
      filtered = true
      searchObj = [        
        {aktif: {[Op.eq]: filtered }}
      ]
    } else if (nonaktifkeywords.some(v => find.includes(v))) {
      filtered = false
      searchObj = [        
        {aktif: {[Op.eq]: filtered }}
      ]
    } else if (dateRegex) {
      filtered = format(new Date(String(find)), 'yyyy-MM-dd');
      searchObj = [
        {tanggal_mulai: {[Op.eq]: filtered }}
      ]
    } else if(id) {
      searchObj = [
        {id_ujian: {[Op.eq]: find}}
      ]
    } else if(alphanum.test(find)) {
      filtered = find.toLowerCase()
      searchObj = [
        {'$PaketSoals.kode_paket$': {[Op.like]:'%' + filtered + '%'}},
        {'$RefJenis.jenis_ujian$': {[Op.like]:'%' + filtered + '%'}},
        {judul_ujian: {[Op.like]:'%' + filtered + '%'}},
        {status_ujian: {[Op.like]:'%' + filtered + '%'}}
      ]        
    } else {
      searchObj = createError.BadRequest('Invalid search query');
    }
    return searchObj;
  },

  soalValidator(find){
    let filtered = find.toLowerCase(), searchObj;
    const idOrbobot = /^[1-9]\d{0,2}(?:\,\d{1,3})?$/.test(find);
    if(idOrbobot){
      searchObj = [
        {id_soal: {[Op.eq]: find }},
        {bobot_soal: {[Op.eq]: find }}
      ]
    } else if(statusSoalKeywords.some(v => find.includes(v))) {
      searchObj = [     
        {status: {[Op.eq]: filtered }},
      ]
    } else if(alphanum.test(find)) {
      searchObj = [
        {'$Matkul.kode_matkul$': {[Op.like]:'%' + filtered + '%'}},
        {'$Matkul.nama_matkul$': {[Op.like]:'%' + filtered + '%'}},
        {soal: {[Op.like]:'%' + filtered + '%'}}
      ] 
    } else {
      searchObj = createError.BadRequest('Invalid search query');
    }          
    return searchObj;
  },

  jawabanValidator(find) {
    let filtered, searchObj;
    const nilai = /^[1-9]\d{0,}(?:\,\d{1,3})?$/.test(find);      
    if(nilai){
      searchObj = [
        {id_jawaban: {[Op.eq]: find }},
        {nilai_jawaban: {[Op.eq]: find }}
      ]
    } else if(alphanum.test(find)) {
      filtered = find.toLowerCase()
      searchObj = [        
        {'$RelPaketSoal.PaketSoal.kode_paket$': {[Op.like]:'%' + filtered + '%'}},
        {jawaban: {[Op.like]:'%' + filtered + '%'}}
      ] 
    } else {
      searchObj = createError.BadRequest('Invalid search query');
    }
    return searchObj;
  },
}