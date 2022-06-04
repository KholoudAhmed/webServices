const hateos = {
    getBlogsHateos: (scheme, hostname) => ({
        'self_url': `${scheme}${hostname}/blogs`,
        'blog_url':  `${scheme}${hostname}/blogs/{blog_id}`,
    }),
    getUsersHateos: (schema, hostname) => ({
        'self_url': `${schema}${hostname}/users`,
        'user_url':  `${schema}${hostname}/users/{user_id}`,
        'user_articles_url':  `${schema}${hostname}/users/{user_id}/articles`,
        'user_spicific_article_url':  `${schema}${hostname}/users/{user_id}/articles/{article_id}`,
    })
}

module.exports = hateos