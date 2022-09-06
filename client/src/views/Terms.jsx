import React from "react";
import { makeStyles } from "@material-ui/core/styles";

// MUI Containers
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";

// Custom Styles
const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "50rem",
    // overflow: "auto",
    padding: "2rem 0",
  },
  lastupdate: {
    color: "#5f6368",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
  },
  counterup: {
    color: "#9d9d9d",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    // alignItems: "center",
    color: "#5f6368",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
    "& img": {
      width: "5rem",
      marginBottom: "1rem",
    },
    "& h1": {
      // fontSize: 50,
      margin: "0 0 2rem 0",
      color: "#b9b9b9",
      fontFamily: "Rubik",
      fontSize: "19px",
      fontWeight: 500,
      letterSpacing: ".005em",
    },
    "& b": {
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "16px",
      fontWeight: 500,
      letterSpacing: ".005em",
    },
  },
});

const Terms = () => {
  // Declare State
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Container className={classes.container}>
        <h1>📜 TERMS OF SERVICE<br/><span className={classes.lastupdate}>Last Update: 9th October 2020</span></h1>
        <section>
          <p>
          This end user agreement (the "Agreement") should be read by you (the "User" or "you") in its entirety prior to your use of degencups's service or products. Please note that the Agreement constitutes a legally binding agreement between you and degencups (referred to herein as "degencups", "us" or "we") which owns and operates the Internet site found and games described at degencups.live (the "Service"). By clicking the "Accept Terms" button if and where provided and/or using the Service, you consent to the terms and conditions set forth in this Agreement.
          <br/><br/>
          We reserve the right to update, change, or replace any part of these Terms of Service without notice. It is your responsibility to check these Terms of Service periodically for updates. Your continued use or access to the Service following any updates constitutes your acceptance of those updates.
          </p>
        </section>
        <section>
          <b><span className={classes.counterup}>1.</span> LICENSE GRANT</b>
          <p>
          <span className={classes.counterup}>1.1.</span> degencups grants you a limited, non-transferable, royalty-free license to use the Service in accordance with the terms of this agreement.
          </p>
          <p>
          <span className={classes.counterup}>1.2.</span> Use of this website is restricted to Users that are (a) 18 years of age or older and (b) over the legal age of majority in their jurisdiction.
          </p>
          <p>
          <span className={classes.counterup}>1.3.</span> You are under no legal disability that would prevent you from forming a binding contract with us.
          </p>
        </section>
        <section>
          <b><span className={classes.counterup}>2.</span> PROHIBITED USES</b>
          <p>
          <span className={classes.counterup}>2.1.</span> The Service is intended solely for the User’s personal use. The User is only allowed to wager for his/her personal entertainment and may not create multiple accounts, including for the purpose of collusion and/or abuse of service.
          </p>
          <p>
          <span className={classes.counterup}>2.2.</span> Persons located in or residents of the United States, Australia, Aruba, Bonaire, Curaçao, Cyprus, France, Netherlands, Saba, Statia, Iran, or St Martin (the ”Prohibited Jurisdictions”) are not permitted to make use of the Service. For the avoidance of doubt, the foregoing restrictions on engaging in real-money play from Prohibited Jurisdictions applies equally to residents and citizens of other nations while located in a Prohibited Jurisdiction. Any attempt to circumvent the restrictions on play by any persons located in a Prohibited Jurisdiction or Restricted Jurisdiction, is a breach of this Agreement. An attempt at circumvention includes, but is not limited to, manipulating the information used by degencups to identify your location and providing degencups with false or misleading information regarding your location or place of residence.
          </p>
          <p>
          <span className={classes.counterup}>2.3.</span> degencups may not be used for illegal or unauthorized purposes and you must abide completely by the laws, rules, and regulations that apply to you. Whether that be federal, state, or local laws.
          </p>
        </section>
        <section>
          <b>3. LIMITATIONS AND LIABILITY.</b>
          <p>
          <span className={classes.counterup}>3.1.</span> You understand and agree to defend, indemnify and hold no liability or accountability to degencups, its licensors, licensees, distributors, agents representatives and other authorized users, and all of the foregoing entities' respective officers, directors, owners, employees, agents, representatives, and assigns from and against any and all claims, damages, obligations, losses, liabilities, costs, attorneys’ fees, and expenses in the occasion of or in connection with, your use of the website, your violation construed to the terms of service, the sale, purchase or use of any items, your violation of any third party right, including but not limited to copyright, trademark or privacy right and any submittance by you that causes damage to a third party. You are expected to participate and cooperate to whatever extent required in the defence of any claim. degencups reserves the right to assume the exclusive defence and control of any matter otherwise subject to indemnification by you. You will not discuss or enter any settlement agreement that affects the rights of degencups without degencups's written permission.
          </p>
        </section>
        <section>
          <b>4. USER SUBMITTED CONTENT.</b>
          <p>
          <span className={classes.counterup}>4.1.</span> You understand that you own all intellectual property rights in any user submitted content or that you have the applicable rights and or permissions from the owner of the content. By submitting user submitted content to the website you automatically allow permission for degencups to a worldwide, perpetual, irrevocable royalty free transferable right and license to use, copy, modify adapt, publish, translate, create derivative works, and distribute your user submitted content.
          </p>
          <p>
          <span className={classes.counterup}>4.2.</span> degencups is not liable for any user submitted content or third party content displayed or submitted to the website.
          <br/><br/>
          If you believe that any content on the website breaches your copyright, trademarks, or other intellectual property right please send a written notification of your claim to degencups via Live Chat Ticket or Discord.
          </p>
        </section>
        <section>
          <b>5. RELATIONSHIP OF PARTIES.</b>
          <p>
          <span className={classes.counterup}>5.1.</span> No joint venture, employment or agency exists between you and degencups and nothing in these terms of use will be interpreted as creating any type of joint venture, employment or partnership.
          </p>
        </section>
        <section>
          <b>6. PAYMENTS AND FEES</b>
          <p>
          <span className={classes.counterup}>6.1.</span> You the user comprehends that you are the owner of any cryptocurrency address or accounts you use on degencups services. You understand and agree that any billing information that you provide to degencups may be passed on by degencups to companies working in line with or on degencups behalf such as payment processors and/or credit agencies solely for the purposes of effecting payment to degencups and Sellers.
          </p>
          <p>
          <span className={classes.counterup}>6.2.</span> You agree that degencups is not liable for the actions for any third-party payment processors and, on any dispute resulting from the third-party payment processor such as payment holds, you agree to resolve your dispute directly with them.
          </p>
          <p>
          <span className={classes.counterup}>6.2.</span> You agree that degencups is not liable for the actions for any third-party payment processors and, on any dispute resulting from the third-party payment processor such as payment holds, you agree to resolve your dispute directly with them.
          </p>
          <p>
          <span className={classes.counterup}>6.3.</span> On the occasion that a buyer on the site receives a refund through a third-party payment processor used by degencups the Buyer shall abide by degencups to pay any applicable transaction fees involved. Also including any further fees or charges imposed by third parties by the use of external services related to the transaction.
          </p>
        </section>
        <section>
          <b>7. KNOW YOUR CUSTOMER.</b>
          <p>
          <span className={classes.counterup}>7.1.</span> degencups reserves the right, at any time, to request KYC documentation it deems necessary to determine the identity and location of a User. degencups reserves the right to restrict service and payment until identity is sufficiently determined.
          </p>
        </section>
        <section>
          <b>8. SEVERABILITY.</b>
          <p>
          <span className={classes.counterup}>8.1.</span> If any part of these terms of service is represented as invalid or unenforceable under any statute, regulation, ordinance, or by any arbitrator or court of competent jurisdiction, then such action will be taken to ensure the terms of service is amended, parts deleted or reformed in any such way to meet the guidelines of the aforementioned regulations. All other remaining passages within the terms of service will remain in effect and must be adhered to at all times.
          </p>
        </section>
        <section>
          <b>ADDITIONAL TERMS AND CONDITIONS.</b>
          <p>
          GOOGLE. We make use of reCAPTCHA services and your use of reCAPTCHA is subject to the Google Privacy Policy and Terms of Use.
          </p>
        </section>
      </Container>
    </Box>
  );
};

export default Terms;
