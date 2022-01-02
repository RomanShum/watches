import { Component } from "react";
import React from "react";
import moment from "moment";
import "moment/locale/ru";
import { v1 as uuidv1 } from "uuid";
import "./App.css";

const fetch = (url) => {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({
        time: moment().utc().format("LTS"),
      });
    }, 1000);
  });
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      title: "",
      utc: 0,
      count: 0,
      userData: [],
      items: [],
    };

    this.interval = undefined;
  }

  componentDidMount() {
    this.loadTime();
    this.interval = window.setInterval(this.loadTime, 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  loadTime = () => {
    fetch("http://fakeurl.ru").then((data) => {
      let arr = [];
      this.state.userData.map((item, i) => {
        arr.push({
          id: i,
          title: item.title,
          time: moment()
            .utc()
            .utcOffset(item.time * 60)
            .format("LTS"),
        });
      });
      this.setState({
        loading: false,
        items: arr,
      });
    });
  };

  onSubmitForm = (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      userData: [
        ...prevState.userData,
        { id: this.state.count, title: this.state.title, time: this.state.utc },
      ],
    }));
    e.target.title.value = "";
    e.target.utc.value = 0;
    this.setState({
      title: "",
      utc: 0,
    });
  };

  onChangeHandlerTitle = ({ target: { value: title } }) => {
    this.setState({
      title,
    });
  };

  onChangeHandlerUtc = ({ target: { value: utc } }) => {
    this.setState({
      utc,
    });
  };

  onChangeHandlerDelete = ({ target }) => {
    let new_arr_clock = this.state.items.filter(
      (_item, i) => i !== Number(target.dataset.id)
    );
    let new_arr_data = this.state.userData.filter(
      (_item, i) => i !== Number(target.dataset.id)
    );
    this.setState({
      items: new_arr_clock,
      userData: new_arr_data,
    });
  };

  clocks = () => {
    const { items } = this.state;
    let html = items.map((item) => (
      <p key={uuidv1()}>
        {item.title} {item.time}
        <span
          className="del"
          data-id={item.id}
          onClick={this.onChangeHandlerDelete}
        >
          {" "}
          X
        </span>
      </p>
    ));

    return html;
  };

  render() {
    if (this.state.loading) {
      return <div>ЗАГРУЗКА</div>;
    }
    return (
      <div className="App">
        <form onSubmit={this.onSubmitForm}>
          <input
            name="title"
            type="text"
            onChange={this.onChangeHandlerTitle}
            defaultValue={this.state.title}
          />
          <input
            name="utc"
            type="number"
            onChange={this.onChangeHandlerUtc}
            defaultValue={this.state.utc}
          />
          <button type="submit">Add</button>
        </form>
        <div className="res">{this.clocks()}</div>
      </div>
    );
  }
}

export default App;
