class IdentifierResolver {

    normalize(id) {

        if (!id)
            return null;

        return id
            .split(":")[0]
            .replace(/@.*/, "");

    }

}

module.exports = IdentifierResolver;
