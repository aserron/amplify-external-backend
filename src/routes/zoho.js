var express = require('express');

/**
 * Zoho Consumer Endpoint Definition
 *
 * @openapi
 * /zoho:
 *  /save:
 *      get:
 *          description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
var router = express.Router();

const axios = require("axios")



/**
 *
 * @returns {axios.AxiosPromise}
 */
function getRefreshedToken(){
    const refreshConfig = {
        method: 'post',
        url: 'https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.152099c5f964c9211038e3ecdca0df90.551441c19d3225870a2bf0dd76169b01&client_id=1000.EQYZLSIQFA34VRCDMIZ2W3PFP8TPHI&client_secret=13557907c4546e55a80b6600b3b1fc822a726c0b3a&grant_type=refresh_token',
        headers: {
            'Cookie': 'b266a5bf57=57c7a14afabcac9a0b9dfc64b3542b70; iamcsr=51cc2dde-0b07-4c90-b6dc-3ffa75cdb357; _zcsr_tmp=51cc2dde-0b07-4c90-b6dc-3ffa75cdb357'
        }
    };

    return  axios(refreshConfig);
}

/* GET /zoho/save */
router.get('/save', async function(req, res, next) {

    try {

        const { firstName, lastName, email, user, description, location, website, twitter_username } = req.body

        const refreshToken = await getRefreshedToken();

        axios({
            method  : 'post',
            url     : 'https://recruit.zoho.com/recruit/v2/Candidates',
            headers : {
                'Authorization': `Zoho-oauthtoken ${refreshToken.data.access_token}`,
                'Content-Type': 'application/json'
            },
            data: {
                "data": [{
                    "Origin": "Github Search Utility",
                    "Skill_Set": description,
                    "Github": user,
                    "Current_Employer": null,
                    "Street": null,
                    "Email": email,
                    "Zip_Code": null,
                    "Experience_in_Years": null,
                    "$approved": true,
                    "State": null,
                    "Country": location,
                    "Rating": null,
                    "$applied_with_linkedin": null,
                    "Website": website,
                    "Twitter": twitter_username,
                    "Salutation": null,
                    "Applying_for": null,
                    "Source": "Github Search Utility",
                    "First_Name": firstName,
                    "Full_Name": firstName + " " + lastName,
                    "Phone": null,
                    "Mobile": null,
                    "Last_Name": lastName,
                    "Current_Salary": null,
                    "Expected_Salary": null
                }],

                "trigger": ["approval", "workflow", "blueprint"]
            }
        })
        .then(function (response) {
            res.json(response.data);
        })
        .catch(function (error) {
            res.status(400).json({ error: error.toString() });
        });

    }
    catch (err) {
        console.error(err)
        res.error(err.message)
    }
});

module.exports = router;
