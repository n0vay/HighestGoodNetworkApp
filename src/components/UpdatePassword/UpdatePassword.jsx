import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Form from "../common/Form";
import Joi from "joi";
import { toast } from "react-toastify";
import { updatePassword } from "../../services/userProfileService";
import { logoutUser } from "../../actions/authActions";

class UpdatePassword extends Form {
  state = {
    data: { currentpassword: "", newpassword: "", confirmnewpassword: "" },
    errors: {}
  };

  componentDidMount() {
    document.title = "Update Password";
  }

  schema = {
    currentpassword: Joi.string()
      .required()
      .label("Current Password"),
    newpassword: Joi.string()
      .regex(
        /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
      )
      .required()
      .disallow(Joi.ref("currentpassword"))
      .label("New Password")
      .options({
        language: {
          any: {
            invalid: "should not be same as old password"
          },
          string: {
            regex: {
              base:
                "should be at least 8 characters long and must include at least one uppercase letter, one lowercase letter, and one number or special character"
            }
          }
        }
      }),

    confirmnewpassword: Joi.any()
      .valid(Joi.ref("newpassword"))
      .options({ language: { any: { allowOnly: "must match new password" } } })
      .label("Confirm Password")
  };

  doSubmit = async () => {
    const { currentpassword, newpassword, confirmnewpassword } = {
      ...this.state.data
    };
    let userId = this.props.match.params.userId;
    let data = { currentpassword, newpassword, confirmnewpassword };
    try {
      await updatePassword(userId, data);

      toast.success(
        "Your password has been updated. You will be logged out and directed to login page where you can login with your new password.",
        {
          onClose: () => {
            // window.location.assign("/login")
            this.props.logoutUser();
            this.props.history.replace("/login");
          }
        }
      );
    } catch (exception) {
      if (exception.response.status === 400) {
        let { errors } = this.state;
        errors["currentpassword"] = exception.response.data.error;
        this.setState({ errors });
      } else {
        toast.error("Something went wrong. Please contact your administrator.");
      }
    }
  };

  render() {
    return (
      <div className="container mt-5">
        <h2>Change Password</h2>

        <form className="col-md-6 xs-12" onSubmit={e => this.handleSubmit(e)}>
          {this.renderInput({
            name: "currentpassword",
            label: "Current Password:",
            type: "password"
          })}
          {this.renderInput({
            name: "newpassword",
            label: "New Password:",
            type: "password"
          })}
          {this.renderInput({
            name: "confirmnewpassword",
            label: "Confirm Password:",
            type: "password",
            "data-refers": "newpassword"
          })}
          {this.renderButton("Submit")}
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(
  connect(mapStateToProps, { 
    logoutUser
  })(UpdatePassword)
);