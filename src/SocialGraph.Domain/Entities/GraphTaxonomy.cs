namespace SocialGraph.Domain.Entities;

public static class GraphTaxonomy
{
    public const string Employee = "employee";
    public const string Skill = "skill";
    public const string Department = "department";
    public const string Interest = "interest";
    public const string Topic = "topic";

    private static readonly HashSet<string> EntityTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        Employee,
        Skill,
        Department,
        Interest,
        Topic
    };

    private static readonly HashSet<string> RelationshipKinds = new(StringComparer.OrdinalIgnoreCase)
    {
        "has-skill",
        "in-department",
        "interested-in",
        "related-to"
    };

    public static bool IsEntityTypeAllowed(string type) => EntityTypes.Contains(type);

    public static bool IsRelationshipKindAllowed(string kind) => RelationshipKinds.Contains(kind);
}
