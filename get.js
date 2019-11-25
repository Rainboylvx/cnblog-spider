const cheerio = require("cheerio")
const {execSync:exec} = require("child_process")

const info = console.error
const print = console.log

const up_id = process.argv[2]

if( !up_id){
  info(`usage node get.js <up_id>`)
  process.exit(0)
}

const base_url = `https://www.cnblogs.com/${up_id}/default.html?page=`

function get_html(url){
  return exec(`curl ${url}`,{stdio:['pipe','pipe','ignore'],encoding:'utf-8'})
}


function get_page_link(page=1){
  let url = base_url+(page+'');
  let html = get_html(url)
  $ = cheerio.load(html,{decodeEntities: false});
  print(`\n## 页面${page}\n`)
  print_page_link($)

  //没有下一页
  let next = $(`a[href="${base_url}${page+1}"]`).length 
  if(!next) return;
  //print( `next = `,!next)
  get_page_link(page+1)
}

function get_time(con){
  let reg = /[\d]{4}-[\d]{2}-[\d]{2} [\d]{2}:[\d]{2}/
  return con.match(reg)[0]
}

function print_page_link($){
  $('div.day').each( function(){
    let time = $(this).children('.postDesc')
    let postTitle = $(this).children('div.postTitle')
    for( let i =0 ;i < time.length;i++){
      let title = $(postTitle[i]).children('a.postTitle2').html().trim().replace('[','「').replace(']','」')
      let href = $(postTitle[i]).children('a.postTitle2').attr('href').trim()
      let _time = get_time($(time[0]).html()) 
      print(`- [${title}](${href}) ${_time}`)
      //print( time.length,postTitle.length)
      //print($(time[0]).html())
    }
  })
}

get_page_link(1)
