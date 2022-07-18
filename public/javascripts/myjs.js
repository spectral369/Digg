class Beverage {

  name;
  quantity = 0;
  masa = '';
  price = 0;
  icon;
  description;

  constructor(name,quantity,masa,price,icon, description){
      this.name = name;
      this.quantity = quantity;
      this.masa = masa;
      this.price = price;
      this.icon = icon;
      this.description = description;
  }

  draw(){

  }

  increment(){
   this.quantity++;
  }

  decrement(){
    if(this.quantity>0)
      this.quantity--
  }

  print(){
    return this.name +" "+this.quantity;
  }


}

function validatePassword() {
  var password = document.getElementById("password")
    , confirm_password = document.getElementById("password2");

  if (password.value != confirm_password.value) {
    confirm_password.style.color = "red";
  } else {
    if (confirm_password.value.length < 5) {
      confirm_password.style.color = "red"
    } else {
      confirm_password.style.color = "white";
    }
  }

  if (password.value.length < 5) {
    password.style.color = "red"
  } else {
    password.style.color = "white";
  }

}

function passwordVa() {
  var password_login = document.getElementById('passwordLogin');
  var curr_str = password_login.value;

  if (curr_str.length < 4) {
    password_login.style.color = "red";
  } else {
    password_login.style.color = "white";
  }
  password_login.value = curr_str;

}



function capitalize_fullname() {
  var full_name = document.getElementById('namefull');
  var curr_str = full_name.value;
  curr_str = curr_str.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  curr_str = curr_str.replace(/[^A-Za-z ]*$/gm, "");
  full_name.value = curr_str;

}


function all_lowercase() {
  var full_name = document.getElementById('usernameLogin');
  var curr_str = full_name.value;
  curr_str = curr_str.toLowerCase();
  curr_str = curr_str.replace(/[^A-Za-z0-9]*$/gm, "");
  if (curr_str.length < 4) {
    full_name.style.color = "red";
  } else {
    full_name.style.color = "white";
  }
  full_name.value = curr_str;

}




const beer_birra_moretti_doza =  new Beverage('Birra Moretti',0,"0.5L",6,'/images/baverages/beer1.png',"Doza Bere Birra Moretti 0.5L");
const beer_heineken_doza =  new Beverage('Heineken',0,"0.5L",8,'/images/baverages/beer1.png',"Doza Bere Heineken 0.5L");
const beer_corona_sticla =  new Beverage('Corona',0,"0.35L",15,'/images/baverages/beer2.png',"Sticla Bere Corona 0.35L");
const suc_cola_doza =  new Beverage('Coca Cola',0,"0.5L",5,'/images/baverages/doza2.png',"Doza Coca Cola 0.5L");
const suc_fanta_doza =  new Beverage('Fanta',0,"0.5L",5,'/images/baverages/doza2.png',"Doza Fanta 0.5L");
const energizant_red_bull_doza =  new Beverage('Red Bull',0,"0.35L",10,'/images/baverages/doza1.png',"Doza Red BUll 0.35L");
const apa_plata_plastic =  new Beverage('Apa Plata',0,"0.5L",5,'/images/baverages/apa1.png',"Sticla Apa Plata 0.5L");
const apa_minerala_plastic =  new Beverage('Apa Minerala',0,"0.5L",5,'/images/baverages/apa1.png',"Sticla Apa Minerala 0.5L");
const long_drink_vodka =  new Beverage('Long Drink Vodka',0,"0.??L",15,'/images/baverages/cup2.png',"Long Drink Vodka 0.??L");
const long_drink_rom =  new Beverage('Long Drink Rom',0,"0.??L",15,'/images/baverages/cup2.png',"Long Drink Rom 0.??L");
const long_drink_gin =  new Beverage('Long Drink Gin',0,"0.??L",15,'/images/baverages/cup2.png',"Long Drink Gin 0.??L");
const long_drink_whiskey =  new Beverage('Long Drink Wiskey',0,"0.??L",20,'/images/baverages/cup2.png',"Long Drink Wiskey 0.??L");
const vodka =  new Beverage('Vodka',0,"0.1L",16,'/images/baverages/cup1.png',"Vodka 0.1L");
const gin =  new Beverage('Gin',0,"0.1L",16,'/images/baverages/cup1.png',"Gin 0.1L");
const rom =  new Beverage('Rom',0,"0.1L",16,'/images/baverages/cup1.png',"Vodka 0.1L");
const whiskey =  new Beverage('Whiskey',0,"0.1L",24,'/images/baverages/cup1.png',"Whiskey 0.1L");
const shoturi =  new Beverage('Shot',0,"0.??L",5,'/images/baverages/shot1.png',"Shot 0.??L");
const promotie_jack_sticla =  new Beverage('Sticla Jack Daniels',0,"0.7L",200,'/images/baverages/bottle1.png',"Sticla Jack Daniels 0.7L");
const promotie_vodka_sticla =  new Beverage('Sticla Vodka',0,"0.7L",200,'/images/baverages/bottle1.png',"Sticla Vodka 0.7L");
const promotie_gin_sticla =  new Beverage('Sticla Gin',0,"0.7L",200,'/images/baverages/bottle1.png',"Sticla Gin 0.7L");
const promotie_rom_sticla =  new Beverage('Sticla Rom',0,"0.7L",200,'/images/baverages/bottle1.png',"Sticla Rom 0.7L");
const suc_natural =  new Beverage('Suc Natural',0,"0.5L",20,'/images/baverages/juice1.png',"Sticla Suc natural 0.5L");

//const gin =  new Beverage('Gin',0,"0.1L",8,'/images/baverages/gin.png',"Gin");

const bev =  [beer_birra_moretti_doza,beer_heineken_doza,beer_corona_sticla,suc_cola_doza,suc_fanta_doza,energizant_red_bull_doza,apa_plata_plastic,
              apa_minerala_plastic, long_drink_vodka,long_drink_rom,long_drink_gin,long_drink_whiskey,vodka,gin,rom,whiskey,shoturi,
            promotie_jack_sticla,promotie_vodka_sticla,promotie_gin_sticla,promotie_rom_sticla,suc_natural];

function generate(){
 
bev.forEach(generateBeverages);
window.onclick = function () {
  var sum = 0;
  var total = 0;
  bev.forEach(function(item){
    if(item.quantity>0){

      var n1 = Number(item.quantity);
      var n2 = Number(item.price);
      sum = n1 * n2;
     
     total +=sum;
    // console.log("item q: "+n1 + " item price: "+n2 +" sum: "+total);
    }

      
  });
  document.getElementById("total").textContent = total;
  }
}

function generateBeverages(item) {
   var container =  document.getElementById('container');

   var div_root = document.createElement("div");
   div_root.className += 'row row-cols-3 border rounded-pill text-center d-flex justify-content-center align-items-center beverage-item';
   
   var div_col_icon = document.createElement('div');
   div_col_icon.className +='col-md-4';
   div_col_icon.className +=' set_contents';
   var div_icon_text =  document.createElement('div');
   //div_icon_text.className +='icon_and_text';
   var img_icon = document.createElement('img');
   img_icon.src = item.icon;
   var icon_span =  document.createElement('span');
   icon_span.textContent = item.name + ' - '+item.masa;
   div_icon_text.appendChild(img_icon);
   //div_icon_text.appendChild(icon_span);
   div_col_icon.appendChild(div_icon_text);
   div_col_icon.appendChild(icon_span)
   div_root.appendChild(div_col_icon);


   var div_cantitate = document.createElement('div');
   div_cantitate.className += 'col-md-4 text-center d-flex justify-content-center align-items-center';

   var span_cantitate = document.createElement('span');
   var h4 = document.createElement('h4');
   h4.textContent = item.price +'RON';
   span_cantitate.appendChild(h4);
   div_cantitate.appendChild(span_cantitate);
   div_root.appendChild(div_cantitate);


  var div_contor_root= document.createElement('div');
  div_contor_root.className += 'col-md-4 ms-auto text-center d-flex justify-content-center align-items-center';
  var div_input_grp =  document.createElement('div');
  div_input_grp.className += 'input-group';
  var input_minus_grp = document.createElement('span');
  input_minus_grp.className += 'input-group-btn';
  var btn_minus =  document.createElement('button');
  btn_minus.className += 'quantity-left-minus btn btn-danger btn-number';
  btn_minus.setAttribute("type", "button");  
  btn_minus.setAttribute("data-type", "minus");
  btn_minus.setAttribute("data-field", "");
  var minus_icon =  document.createElement('i');
  minus_icon.className += 'fas fa-minus';
  btn_minus.appendChild(minus_icon);
  input_minus_grp.appendChild(btn_minus);
  div_input_grp.appendChild(input_minus_grp);

  var input_counter =  document.createElement('input');
  input_counter.setAttribute("type","text");
  input_counter.id = 'quantity';
  input_counter.className += 'form-control bg-dark';
  input_counter.name = 'quantity';
  input_counter.value = 0;
  input_counter.min = 1;
  input_counter.max = 100;
  input_counter.readOnly = true;
  div_input_grp.appendChild(input_counter);



  var input_plus_grp =  document.createElement('span');
  input_plus_grp.className += 'input-group-btn';
  var btn_plus =  document.createElement('button');
  btn_plus.className += 'quantity-right-plus btn btn-success btn-number';
  btn_plus.setAttribute("type", "button");  
  btn_plus.setAttribute("data-type", "plus");
  btn_plus.setAttribute("data-field", "");
  var plus_icon =  document.createElement('i');
  plus_icon.className += 'fas fa-plus';
  btn_plus.appendChild(plus_icon);
  input_plus_grp.appendChild(btn_plus);
  div_input_grp.appendChild(input_plus_grp);
  div_contor_root.appendChild(div_input_grp);
  div_root.appendChild(div_contor_root);

  container.appendChild(div_root);

  btn_minus.addEventListener("click", function(){
    //delay interval between clicks NEEDED !!!!!!!!!!!!! TODO
    item.decrement();
    input_counter.value = item.quantity;
   // console.log(item.print());
    document.querySelector('#quantity').dispatchEvent(new Event('change', { 'bubbles': true }))
});

  btn_plus.addEventListener("click", function(){
    item.increment();
    input_counter.value = item.quantity;
   // console.log(item.print());
    document.querySelector('#quantity').dispatchEvent(new Event('change', { 'bubbles': true }))
});

}


