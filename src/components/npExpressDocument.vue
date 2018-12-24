<template>
  <div>
    <div
      class="modal"
      id="exampleModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{orderData.id}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body container">
            <div class="row">
              <div class="form-group col-12">
                <label for>Способ доставки</label>
                <select name id class="custom-select">
                  <option value>Новая почта</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-12">
                <label for>Плательщик</label>
                <select class="custom-select" v-model="payerType">
                  <option value="Recipient">Получатель</option>
                  <option value="Sender">Отправитель</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-6">
                <label for>Фамилия</label>
                <input class="form-control" v-model="orderData.clientSurname">
              </div>
              <div class="form-group col-6">
                <label for>Имя</label>
                <input class="form-control" v-model="orderData.clientName">
              </div>
            </div>
            <div class="row">
              <div class="form-group col-6">
                <label for>Отчество</label>
                <input class="form-control" v-model="orderData.clientSecondName">
              </div>
              <div class="form-group col-6">
                <label for>Телефон</label>
                <masked-input
                  class="form-control"
                  v-model="orderData.clientPhone"
                  mask="\+\380111111111"
                />
              </div>
            </div>
            <div class="row">
              <div class="form-group col-12">
                <label for>Способ получения</label>
                <select class="custom-select" v-model="serviceType">
                  <option value="WarehouseWarehouse">В отделении</option>
                  <option value="WarehouseDoors">По адресу</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-12">
                <label for>Город</label>
                <model-select
                  class="custom-select selectpicker"
                  :options="cities"
                  v-model="item"
                  placeholder="select item"
                ></model-select>
              </div>
            </div>
            <div class="row" v-show="!this.isServiceType()">
              <div class="form-group col-6">
                <label for>Улица</label>
                <!-- <input class="form-control" v-model="orderData.address"> -->
                <model-select
                  class="custom-select selectpicker"
                  :options="streets"
                  v-model="itemStreet"
                  placeholder="select item"
                ></model-select>
              </div>
              <div class="form-group col-6">
                <label for>Номер дома</label>
                <input class="form-control" v-model="house">
              </div>
              <div class="form-group col-6">
                <label for>Квартира</label>
                <input class="form-control" v-model="flat">
              </div>
            </div>
            <div class="row">
              <div class="form-group col-12" v-show="this.isServiceType()">
                <label for>Отделение получения</label>
                <model-select
                  class="custom-select selectpicker"
                  :options="warehouses"
                  v-model="recipientWarehouseRef"
                  placeholder="select item"
                ></model-select>
                <!-- <select class="custom-select" v-model="recipientWarehouse">
                <option v-for="Warehouse of this.warehouses" :key="Warehouse.Ref" :val="Warehouse.Ref">{{Warehouse.text}}</option>
                </select>-->
              </div>
            </div>
            <div class="row">
              <div class="form-group col-12">
                <label for>Место отправки</label>
                <select name id class="custom-select">
                  <option
                    value="16922821-e1c2-11e3-8c4a-0050568002cf"
                  >Отделение №78 (до 30 кг): ул. Магнитогорская, 1а (Дарынок)</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-12">
                <label for>Тип посылки</label>
                <select class="custom-select" v-model="cargoTypes">
                  <option value="Parcel">Посылка</option>
                  <option value="Cargo">Груз</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-6">
                <label for>Номер упаковки (необяз.)</label>
                <input class="form-control">
              </div>
              <div class="form-group col-6">
                <label for>Объявленная стоимость</label>
                <input class="form-control" v-model="orderData.total">
              </div>
            </div>
            <div class="row">
              <div class="form-group col-6">
                <label for>Дата отправки</label>
                <datepicker v-model="dateSend" :format="customFormatter"></datepicker>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-12">
                <label for>Доп. информация</label>
                <textarea class="form-control" rows="3" v-model="description"></textarea>
              </div>
            </div>
            <div class="row col-12 mb-2">
              <div class="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="customCheck1"
                  v-model="backwardDelivery"
                >
                <label class="custom-control-label" for="customCheck1">Заказать обратную доставку</label>
              </div>
            </div>
            <div class="row" v-show="backwardDelivery">
              <div class="form-group col-12">
                <label for>Плательщик при обратной доставке</label>
                <select class="custom-select" v-model="backwardPayerType">
                  <option value="Recipient">Получатель</option>
                  <option value="Sender">Отправитель</option>
                </select>
              </div>
            </div>
            <div class="row" v-show="backwardDelivery">
              <div class="form-group col-12">
                <label for>Тип посылки обратной доставки</label>
                <select class="custom-select" v-model="backwardTypeCargo">
                  <option value="Documents">Документы</option>
                  <option value="Money">Деньги</option>
                </select>
              </div>
            </div>
            <div class="row" v-show="backwardDelivery && !this.isBackwardTypeCargo()">
              <div class="form-group col-6">
                <label for>Сумма обратной доставки</label>
                <input class="form-control" v-model="backwardSum">
              </div>
            </div>
            <div class="row" v-show="backwardDelivery && !this.isBackwardTypeCargo()">
              <div class="form-group col-12">
                <label for>Стоимость обратной доставки: {{backwardPay}}грн</label>
              </div>
            </div>
            <div class="row" v-show="backwardDelivery && this.isBackwardTypeCargo()">
              <div class="form-group col-12">
                <label for>Описание обратной доставки</label>
                <input type="text" class="form-control">
              </div>
            </div>
            <div
              class="row"
              v-for="(dimension, index) of this.dimensions"
              :key="'dimension-'+index"
            >
              <div class="form-group col-3">
                <label for>Вес, кг</label>
                <input class="form-control" v-model="dimension.weight">
              </div>
              <div class="form-group col-3">
                <label for>Длина, см</label>
                <input class="form-control" v-model="dimension.long">
              </div>
              <div class="form-group col-3">
                <label for>Ширина, см</label>
                <input class="form-control" v-model="dimension.width">
              </div>
              <div class="form-group col-3">
                <label for>Высота, см</label>
                <input class="form-control" v-model="dimension.height">
              </div>
            </div>
            <div class="col-12 row">
              <label class="col-4" for>Объемный вес</label>
              <input class="form-control col-2" disabled="disabled" v-model="volumeWeight">
            </div>
            <div class="row col-12">
              <a href="#" @click="addPlace()">+ Добавить место</a>
            </div>
            <div class="col-12">
              <ul class v-for="(errorForm, index) of this.errors" :key="'error'+index">
                <li class="alert alert-danger">{{errorForm}}</li>
              </ul>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="addDocument()">Save changes</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
      <i class="far fa-file-alt"></i>
    </button>
  </div>
</template>
<script>
import axios from "axios";
import VueResource from "vue-resource";
import { ModelSelect } from "vue-search-select";
import Datepicker from "vuejs-datepicker";
import moment from "moment";
import MaskedInput from "vue-masked-input";

export default {
  name: "npExpressDocument",
  props: ["order-data", "order-products"],
  data() {
    return {
      cargoTypes: "Parcel",
      backwardTypeCargo: "Documents",
      BackwardDeliveryCargoTypes: [],
      backwardDelivery: 0,
      backwardPayerType: "Sender",
      backwardPay: 0,
      backwardSum: 0,
      cities: [],
      description: "",
      errors: [],
      modalShown: false,
      streets: [],
      payerType: "Sender",
      recipientWarehouse: "",
      recipientWarehouseRef: "",
      warehouses: [],
      item: {
        value: "",
        text: ""
      },
      warehouses1: {
        value: "",
        text: ""
      },
      itemStreet: {
        value: "",
        text: ""
      },
      house: "",
      flat: "",
      dimensions: [
        {
          weight: 1,
          long: 5,
          width: 5,
          height: 5
        }
      ],
      serviceType: "WarehouseWarehouse",
      documentData: {}
    };
  },
  computed: {
    volumeWeight() {
      return this.dimensions.reduce(
        (acc, el) =>
          acc +
          Math.round(((el.long * el.width * el.height) / 4000) * 100) / 100,
        0
      );
    },
    volumeGeneral() {
      return this.dimensions.reduce(
        (acc, el) =>
          acc +
          Math.round(el.long * el.width * el.height * 100) / 100 / 1000000,
        0
      );
    },
    totalSeets() {
      return this.dimensions.reduce((acc, el) => acc + 1, 0);
    },
    dateSend() {
      return moment().format();
    }
  },
  watch: {
    item() {
      this.getWarehouses();
      this.getStreets();
    },
    backwardSum() {
      this.calculateBackwardPay();
    },
    itemStreet() {
      this.getStreets();
    },
    recipientWarehouse() {
      this.recipientWarehouseRef = this.warehouses.find(
        el => el.text === this.recipientWarehouse
      ).value;
    }
  },
  mounted: function() {
    this.getCities();
  },
  methods: {
    toggleModal() {
      this.modalShown = !this.modalShown;
    },
    validateForm() {
      this.errors = [];
      if (this.orderData.clientName === "") {
        this.errors.push('Не заполнено поле "Имя"');
      }
      if (this.orderData.clientSurname === "") {
        this.errors.push('Не заполнено поле "Фамилия"');
      }
      if (this.orderData.clientSecondName === "") {
        this.errors.push('Не заполнено поле "Отчество"');
      }
      if (this.orderData.clientPhone === "") {
        this.errors.push('Не заполнено поле "Телефон"');
      }
      if (this.item.text === "") {
        this.errors.push('Не заполнено поле "Город"');
      }
      if (
        this.serviceType === "WarehouseDoors" &&
        this.itemStreet.text === ""
      ) {
        this.errors.push('Не заполнено поле "Адрес"');
      }
      if (this.serviceType === "WarehouseDoors" && this.house === "") {
        this.errors.push('Не заполнено поле "Номер дома"');
      }
      if (this.serviceType === "WarehouseDoors" && this.house === "") {
        this.errors.push('Не заполнено поле "Квартира"');
      }
      // if (this.serviceType === "WarehouseWarehouse" && this.recipientWarehouseRef === "") {
      //   this.errors.push('Не заполнено поле "Отделение"');
      // }
      if (this.description === "") {
        this.errors.push('Не заполнено поле "Доп.информация"');
      }
    },
    customFormatter(date) {
      return moment(date).format("DD.MM.YYYY");
    },
    addPlace() {
      this.dimensions.push({ weight: 1, long: 5, width: 5, height: 5 });
    },
    calculateBackwardPay() {
      if (this.backwardSum === 0) {
        this.backwardPay = "";
      } else {
        this.backwardPay = 20 + (this.backwardSum / 100) * 2;
      }
    },
    isBackwardTypeCargo() {
      if (this.backwardTypeCargo === "Documents") {
        return true;
      } else {
        return false;
      }
    },
    isBackwardDelivery() {
      if (this.backwardDelivery === 0) {
        return false;
      } else {
        return true;
      }
    },
    isServiceType() {
      if (this.serviceType === "WarehouseWarehouse") {
        return true;
      } else {
        return false;
      }
    },
    reset() {
      this.item = {};
    },
    resetStreet() {
      this.itemStreet = {};
    },
    selectFromParentComponent1() {
      this.item = this.options[0];
    },
    selectFromParentComponent2() {
      this.itemStreet = this.options[0];
    },
    getWarehouses() {
      axios({
        method: "POST",
        url: `https://api.novaposhta.ua/v2.0/json/`,
        data: {
          modelName: "AddressGeneral",
          calledMethod: "getWarehouses",
          methodProperties: {
            Language: "ru",
            CityRef: `${this.item.value}`
          },
          apiKey: `${this.$store.state.npToken}`
        }
      }).then(res => {
        this.warehouses = [];
        for (let obj of res.data.data) {
          this.warehouses.push({
            value: obj.Ref,
            text: `${obj.DescriptionRu}`
          });
        }
      });
    },
    getCities() {
      axios({
        method: "POST",
        url: `https://api.novaposhta.ua/v2.0/json/`,
        data: {
          modelName: "Address",
          calledMethod: "getCities",
          apiKey: `${this.$store.state.npToken}`
        }
      }).then(res => {
        for (let obj of res.data.data) {
          this.cities.push({
            value: obj.Ref,
            text: `${obj.SettlementTypeDescriptionRu} ${obj.DescriptionRu}`
          });
        }
      });
    },
    getBackwardDeliveryCargoTypes() {
      axios({
        method: "POST",
        url: `https://api.novaposhta.ua/v2.0/json/`,
        data: {
          modelName: "Common",
          calledMethod: "getBackwardDeliveryCargoTypes",
          apiKey: `${this.$store.state.npToken}`
        }
      }).then(res => (this.BackwardDeliveryCargoTypes = res.data.data));
    },
    getStreets() {
      axios({
        method: "POST",
        url: `https://api.novaposhta.ua/v2.0/json/`,
        data: {
          modelName: "Address",
          calledMethod: "getStreet",
          methodProperties: {
            CityRef: `${this.item.value}`
          },
          apiKey: `${this.$store.state.npToken}`
        }
      }).then(res => {
        this.streets = [];
        for (let str of res.data.data) {
          this.streets.push({
            value: str.Ref,
            text: `${str.StreetsType} ${str.Description}`
          });
        }
      });
    },
    saveUser() {
      return axios({
        method: "POST",
        url: `https://api.novaposhta.ua/v2.0/json/`,
        data: {
          apiKey: `${this.$store.state.npToken}`,
          modelName: "ContactPerson",
          calledMethod: "save",
          methodProperties: {
            CounterpartyRef: "f2c0ff13-1525-11e7-8ba8-005056881c6b",
            FirstName: this.orderData.clientName,
            LastName: this.orderData.clientSurname,
            MiddleName: this.orderData.clientSecondName,
            Phone: this.orderData.clientPhone
          }
        }
      });
    },
    saveAdress() {
      if (this.serviceType === "WarehouseDoors") {
        return axios({
          method: "POST",
          url: `https://api.novaposhta.ua/v2.0/json/`,
          data: {
            apiKey: `${this.$store.state.npToken}`,
            modelName: "Address",
            calledMethod: "save",
            methodProperties: {
              CounterpartyRef: "f2c0ff13-1525-11e7-8ba8-005056881c6b",
              StreetRef: this.itemStreet.value,
              BuildingNumber: this.house,
              Flat: this.flat
            }
          }
        });
      }
    },
    addDocument() {
      this.documentData = {
        modelName: "InternetDocument",
        calledMethod: "save",
        methodProperties: {
          PayerType: this.payerType,
          PaymentMethod: "Cash",
          DateTime: this.customFormatter(this.dateSend),
          CargoType: "Cargo",
          VolumeGeneral: `${this.volumeGeneral}`,
          Weight: `${this.volumeWeight}`,
          ServiceType: `${this.serviceType}`,
          SeatsAmount: `${this.totalSeets}`,
          Description: `${this.description}`,
          Cost: `${this.orderData.total}`,
          CitySender: "8d5a980d-391c-11dd-90d9-001a92567626",
          Sender: "f2bc4128-1525-11e7-8ba8-005056881c6b",
          SenderAddress: "16922821-e1c2-11e3-8c4a-0050568002cf",
          ContactSender: "f2bf2bdb-1525-11e7-8ba8-005056881c6b",
          SendersPhone: "+380668199174",
          CityRecipient: `${this.item.value}`,
          Recipient: "f2c0ff13-1525-11e7-8ba8-005056881c6b",
          RecipientAddress: `${this.recipientWarehouseRef}`,
          RecipientsPhone: this.orderData.clientPhone
        },
        apiKey: `${this.$store.state.npToken}`
      };
      this.validateForm();
      if (this.errors.length === 0) {
        axios
          .all([this.saveUser(), this.saveAdress()])
          .then(
            axios.spread((user, adress) => {
              this.documentData.methodProperties.ContactRecipient =
                user.data.data[0].Ref;
              if (adress !== undefined) {
                this.recipientWarehouseRef = adress.data.data[0].Ref;
                this.documentData.methodProperties.RecipientAddress = this.recipientWarehouseRef;
              }
              if (this.backwardDelivery === true) {
                if (this.backwardTypeCargo === "Documents") {
                  this.documentData.methodProperties.BackwardDeliveryData = [
                    {
                      PayerType: this.backwardPayerType,
                      CargoType: this.backwardTypeCargo,
                      Services: {
                        Attorney: true,
                        WaybillNewPostWithStamp: true,
                        UserActions: "UserCallSender"
                      }
                    }
                  ];
                } else if (this.backwardTypeCargo === "Money") {
                  this.documentData.methodProperties.BackwardDeliveryData = [
                    {
                      PayerType: this.backwardPayerType,
                      CargoType: this.backwardTypeCargo,
                      RedeliveryString: `${this.backwardSum}`
                    }
                  ];
                }
              }
              axios({
                method: "POST",
                url: `https://api.novaposhta.ua/v2.0/json/`,
                data: this.documentData
              })
                .then(res => {
                  console.log(res.data);
                  if (this.errors.length === 0) {
                    $(".modal").modal("hide");
                    this.$emit("addNPDocument", res.data);
                  }
                })
                .catch(err => console.log(err));
            })
          )
          .catch(err => console.log(err));
      } else {
        console.log(this.errors.length);
      }
    }
  },
  components: {
    ModelSelect,
    Datepicker
  }
};
</script>
<style>
</style>
