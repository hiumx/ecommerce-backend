
class SiteController {
    async home(req, res, next) {
        try {
        } catch (error) {
            next(error);
        }
    }
};

module.exports = new SiteController();