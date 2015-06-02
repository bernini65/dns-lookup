
function getAns(context, question, type){

  if (type == "A"){
    url = 'http://api.statdns.com/' + question + '/a'
  }
  else if (type == "PTR") {
    var inAddr = question.split(".").reverse().join(".") + ".in-addr.arpa"

    url = 'http://api.statdns.com/' + inAddr + '/ptr'
  }
  $.ajax({
        url: url,
        dataType: 'jsonp',
        success: function(response){

          res = response.answer.reduce(function(prev, cur, elem){
            return prev + cur.rdata.toString() +  "\n"
          }, "");
          
          context.text(res);
    
          
        },
        error: function(xhr, status, error){
          console.log('error');        
       }
    });


}

function parseHostnames(text){

  pattern = /\b(\w+\.)+(ca|com)\b/g;

  matches = text.match(pattern);
  return matches;
  
  //console.log(matches);
}
function parseIPs(text){

  pattern = /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g
  matches = text.match(pattern);
  return matches;

}
function addRow(table, first, second) {
  template = "<tr><td class='col-md-6'>" + first + "</td><td class='col-md-6'>"+ second + "</td></tr>";
  tr = $(template).appendTo(table);
  return tr;
}

$(".submit").on("click", function(){
  text = $("#query").val();

  var hostnameTable = $('.hostnameTable');
  var ipTable = $('.ipTable');
  var hostnamePanel =  $(".hostname-panel");
  var ipPanel =  $(".ip-panel");

  hostnames = parseHostnames(text);
  if (submitted){
      
    hostnameTable.html('<tr><th>A Records</th><th></th></tr>');
    ipTable.html('<tr><th>PTR Records</th><th></th></tr>');
  }

  if (hostnames){
    hostnames.forEach(function(hostname){
      tr = addRow(hostnameTable, hostname, "<i class='fa fa-spinner fa-spin'></i>");
      td= tr.children().eq(1)
      getAns(td, hostname, "A");
    });
    hostnameTable.show();
  }  else {
    hostnameTable.hide();
  }

  ips = parseIPs(text);
  if (ips){
    ips.forEach(function(ip){
      tr = addRow(ipTable, ip, "");
      td= tr.children().eq(1)
      getAns(td, ip, "PTR");
    });

    //$(".results").slideDown(300);
    ipTable.show();

  } else {
    ipTable.hide();
  }
  submitted = true;

});


var submitted = false;
 var text = "msn.ca ubc.ca\namazon.ca it.ubc.ca 137.82.1.2\n8.8.8.8";

 $("#query").val(text);
