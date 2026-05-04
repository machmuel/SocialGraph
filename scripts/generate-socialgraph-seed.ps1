$names = @(
    'Andersson, Daniel', 'Machmueller, Guido', 'Kehl, Sieglinde', 'Schmidt, Sven',
    'Duerselen, Tim', 'Herlitschke, Mike', 'Klingstedt, Andreas', 'Jablonski, Christian',
    'Nord, Dennis', 'Schneider, Klaus', 'Sharma, Sachin Kumar', 'Raffel, Sebastian',
    'Raviteja, Gajula', 'Bobe, Danilo', 'Eichhorn, Stephan', 'Herkert, Marco',
    'Kania, Patrick', 'Maier, Roman', 'Zurek, Torsten', 'Zurhorst, Marcus',
    'Blumer, Andreas', 'Bruederlin, Manuel', 'Ekelund, Olof', 'Gupta, Ayushi',
    'Hallek, Oliver', 'Nandori, Zoltan', 'Polster, Matthias', 'Revanwar, Nilesh',
    'Soderback, Markus (ext)', 'Tiwari, Atul', 'Walther, Juergen', 'Gupta, Shami',
    'Gupta, Shami Kumar', 'Helmrich, Fabian', 'Mishra, Durgesh', 'Roshan, Mandavilli',
    'Saini, Anuj (ext)', 'Schmidt, Anita', 'no-reply-comos-offline-backup@siemens-energy.com',
    'Hensel, Raik', 'Mueller, Markus', 'Pandya, Vaibhav', 'Rajadhyaksha, Sitaram (ext)',
    'Vadlamudi, Prassad (ext)'
)

function Get-EntityId([string]$name) {
    if ($name -like '*@*') {
        return (($name -replace '[^A-Za-z0-9]+', '_').Trim('_'))
    }

    $clean = $name -replace ' \(ext\)', ''
    $parts = $clean -split ',\s*'
    if ($parts.Count -ge 2) {
        return (($parts[1] + '_' + $parts[0]) -replace '[^A-Za-z0-9]+', '_').Trim('_')
    }

    return (($clean -replace '[^A-Za-z0-9]+', '_').Trim('_'))
}

function Get-DisplayName([string]$name) {
    if ($name -like '*@*') {
        return $name
    }

    $ext = if ($name -match '\(ext\)') { ' (ext)' } else { '' }
    $clean = $name -replace ' \(ext\)', ''
    $parts = $clean -split ',\s*'
    if ($parts.Count -ge 2) {
        return "$($parts[1]) $($parts[0])$ext"
    }

    return $name
}

function Add-Edge($edges, [string]$from, [string]$to, [int]$weight, [string[]]$evidence) {
    if ($from -eq $to) {
        return
    }

    $source = Get-EntityId $from
    $target = Get-EntityId $to
    $pair = @($source, $target) | Sort-Object
    $key = "$($pair[0])|$($pair[1])"
    if ($edges.ContainsKey($key)) {
        if ($weight -gt $edges[$key].Weight) {
            $edges[$key].Weight = $weight
            $edges[$key].Evidence = $evidence
        }
        return
    }

    $edges[$key] = [ordered]@{
        Source = $pair[0]
        Target = $pair[1]
        Weight = $weight
        Evidence = $evidence
    }
}

function Add-Clique($edges, [string[]]$people, [int]$weight, [string[]]$evidence) {
    for ($i = 0; $i -lt $people.Count; $i++) {
        for ($j = $i + 1; $j -lt $people.Count; $j++) {
            Add-Edge $edges $people[$i] $people[$j] $weight $evidence
        }
    }
}

function Add-Bipartite($edges, [string[]]$left, [string[]]$right, [int]$weight, [string[]]$evidence) {
    foreach ($from in $left) {
        foreach ($to in $right) {
            Add-Edge $edges $from $to $weight $evidence
        }
    }
}

$edgesByPair = @{}
$e9 = @('turn7search170', 'turn7search174', 'turn7search175', 'turn7search177', 'turn7search192', 'turn7search200', 'turn7search203', 'turn7search231', 'turn7search234')
$e8a = @('turn7search170', 'turn7search174', 'turn7search177', 'turn7search192', 'turn7search200', 'turn7search203', 'turn7search231', 'turn7search234')
$e8b = @('turn7search170', 'turn7search175', 'turn7search177', 'turn7search192', 'turn7search200', 'turn7search203', 'turn7search231', 'turn7search234')
$e7 = @('turn7search170', 'turn7search177', 'turn7search192', 'turn7search200', 'turn7search203', 'turn7search231', 'turn7search234')
$e6 = @('turn7search170', 'turn7search177', 'turn7search192', 'turn7search200', 'turn7search203', 'turn7search231')
$e6m = @('turn7search170', 'turn7search174', 'turn7search175', 'turn7search177', 'turn7search192', 'turn7search200')
$e5 = @('turn7search170', 'turn7search174', 'turn7search175', 'turn7search177', 'turn7search192')
$e5r = @('turn7search170', 'turn7search192', 'turn7search200', 'turn7search203', 'turn7search231')
$e4 = @('turn7search200', 'turn7search203', 'turn7search231', 'turn7search234')
$e3 = @('turn7search170', 'turn7search177', 'turn7search192')
$e3b = @('turn7search200', 'turn7search203', 'turn7search231')
$e2 = @('turn7search170', 'turn7search177')

Add-Edge $edgesByPair 'Andersson, Daniel' 'Machmueller, Guido' 9 $e9
Add-Edge $edgesByPair 'Andersson, Daniel' 'Kehl, Sieglinde' 8 $e8a
Add-Edge $edgesByPair 'Andersson, Daniel' 'Schmidt, Sven' 8 $e8b
Add-Edge $edgesByPair 'Kehl, Sieglinde' 'Machmueller, Guido' 8 $e8a
Add-Edge $edgesByPair 'Machmueller, Guido' 'Schmidt, Sven' 8 $e8b

$core = @('Andersson, Daniel', 'Duerselen, Tim', 'Herlitschke, Mike', 'Kehl, Sieglinde', 'Klingstedt, Andreas', 'Machmueller, Guido', 'Schmidt, Sven')
Add-Clique $edgesByPair $core 7 $e7

Add-Bipartite $edgesByPair $core @('Nord, Dennis', 'Schneider, Klaus') 6 $e6
Add-Clique $edgesByPair @('Nord, Dennis', 'Schneider, Klaus') 6 $e6
Add-Bipartite $edgesByPair @('Andersson, Daniel', 'Machmueller, Guido') @('Jablonski, Christian', 'Sharma, Sachin Kumar') 6 $e6m

Add-Bipartite $edgesByPair @('Andersson, Daniel', 'Duerselen, Tim', 'Herlitschke, Mike', 'Kehl, Sieglinde', 'Klingstedt, Andreas', 'Machmueller, Guido', 'Nord, Dennis', 'Schmidt, Sven', 'Schneider, Klaus') @('Raffel, Sebastian') 5 $e5r
Add-Bipartite $edgesByPair @('Andersson, Daniel', 'Jablonski, Christian', 'Machmueller, Guido') @('Raviteja, Gajula') 5 $e5
Add-Clique $edgesByPair @('Jablonski, Christian', 'Raviteja, Gajula', 'Sharma, Sachin Kumar') 5 $e5

$workstream = @('Bobe, Danilo', 'Eichhorn, Stephan', 'Herkert, Marco', 'Kania, Patrick', 'Maier, Roman', 'Zurek, Torsten')
Add-Bipartite $edgesByPair @('Andersson, Daniel', 'Duerselen, Tim', 'Herlitschke, Mike', 'Kehl, Sieglinde', 'Klingstedt, Andreas', 'Machmueller, Guido', 'Schmidt, Sven') $workstream 4 $e4
Add-Clique $edgesByPair $workstream 4 $e4
Add-Bipartite $edgesByPair $core @('Jablonski, Christian', 'Sharma, Sachin Kumar', 'Zurhorst, Marcus') 4 @('turn7search170', 'turn7search177', 'turn7search192', 'turn7search203')

$broad = @('Blumer, Andreas', 'Bruederlin, Manuel', 'Ekelund, Olof', 'Gupta, Ayushi', 'Hallek, Oliver', 'Nandori, Zoltan', 'Polster, Matthias', 'Revanwar, Nilesh', 'Soderback, Markus (ext)', 'Tiwari, Atul', 'Walther, Juergen')
Add-Bipartite $edgesByPair @('Andersson, Daniel', 'Duerselen, Tim', 'Herlitschke, Mike', 'Kehl, Sieglinde', 'Klingstedt, Andreas', 'Machmueller, Guido', 'Nord, Dennis', 'Schmidt, Sven', 'Schneider, Klaus', 'Raffel, Sebastian') $broad 3 $e3
Add-Bipartite $edgesByPair $workstream @('Blumer, Andreas', 'Bruederlin, Manuel', 'Hallek, Oliver', 'Nandori, Zoltan', 'Polster, Matthias') 3 $e3b
Add-Clique $edgesByPair @('Ekelund, Olof', 'Gupta, Ayushi', 'Raviteja, Gajula', 'Revanwar, Nilesh', 'Tiwari, Atul') 3 $e3

$low = @('Gupta, Shami', 'Gupta, Shami Kumar', 'Helmrich, Fabian', 'Mishra, Durgesh', 'Roshan, Mandavilli', 'Saini, Anuj (ext)', 'Schmidt, Anita', 'no-reply-comos-offline-backup@siemens-energy.com')
Add-Bipartite $edgesByPair @('Andersson, Daniel', 'Bobe, Danilo', 'Duerselen, Tim', 'Eichhorn, Stephan', 'Herlitschke, Mike', 'Kehl, Sieglinde', 'Klingstedt, Andreas', 'Machmueller, Guido', 'Schmidt, Sven', 'Sharma, Sachin Kumar') $low 2 @('turn7search174', 'turn7search175', 'turn7search177', 'turn7search231', 'turn7search234')
Add-Clique $edgesByPair @('Mishra, Durgesh', 'Soderback, Markus (ext)', 'Walther, Juergen') 2 @('turn7search177', 'turn7search234')
Add-Clique $edgesByPair @('Roshan, Mandavilli', 'Raviteja, Gajula', 'Revanwar, Nilesh') 2 @('turn7search170', 'turn7search192')

Add-Bipartite $edgesByPair @('Andersson, Daniel', 'Duerselen, Tim') @('Hensel, Raik', 'Mueller, Markus', 'Pandya, Vaibhav', 'Rajadhyaksha, Sitaram (ext)', 'Vadlamudi, Prassad (ext)') 1 @('turn7search170', 'turn7search175', 'turn7search177', 'turn7search234')

$skillSeeds = @(
    @{ id = 'COMOS'; name = 'COMOS'; note = 'Seeded employee skill'; type = 'skill' },
    @{ id = 'REST_API'; name = 'REST API'; note = 'Seeded employee skill'; type = 'skill' },
    @{ id = 'SnapLogic'; name = 'SnapLogic'; note = 'Seeded employee skill'; type = 'skill' },
    @{ id = 'Azure'; name = 'Azure'; note = 'Seeded employee skill'; type = 'skill' },
    @{ id = 'SQL_Server'; name = 'SQL Server'; note = 'Seeded employee skill'; type = 'skill' },
    @{ id = 'GenAI'; name = 'GenAI'; note = 'Seeded employee skill'; type = 'skill' },
    @{ id = 'MCP'; name = 'MCP'; note = 'Seeded employee skill'; type = 'skill' },
    @{ id = 'Caveman'; name = 'caveman'; note = 'Codex skill available at C:/Users/Guido/.codex/skills/caveman/SKILL.md'; type = 'skill' },
    @{ id = 'Imagegen'; name = 'imagegen'; note = 'Codex image generation skill'; type = 'skill' },
    @{ id = 'OpenAI_Docs'; name = 'openai-docs'; note = 'Codex OpenAI documentation skill'; type = 'skill' },
    @{ id = 'Skill_Creator'; name = 'skill-creator'; note = 'Codex skill authoring skill'; type = 'skill' },
    @{ id = 'Skill_Installer'; name = 'skill-installer'; note = 'Codex skill installation skill'; type = 'skill' },
    @{ id = 'Browser_Use'; name = 'browser-use'; note = 'Codex browser automation skill'; type = 'skill' },
    @{ id = 'Documents'; name = 'documents'; note = 'Codex document editing skill'; type = 'skill' },
    @{ id = 'Presentations'; name = 'presentations'; note = 'Codex presentation authoring skill'; type = 'skill' },
    @{ id = 'Spreadsheets'; name = 'spreadsheets'; note = 'Codex spreadsheet authoring skill'; type = 'skill' }
)

$contextSeeds = @(
    @{ id = 'SE_DC_APB_PLM'; name = 'SE DC APB PLM'; note = 'Seeded department'; type = 'department' },
    @{ id = 'COMOS_Platform'; name = 'COMOS Platform'; note = 'Seeded department'; type = 'department' },
    @{ id = 'IT_Service_Operations'; name = 'IT Service Operations'; note = 'Seeded department'; type = 'department' },
    @{ id = 'COMOS_Integration'; name = 'COMOS Integration'; note = 'Seeded topic'; type = 'topic' },
    @{ id = 'AI_Architecture'; name = 'AI Architecture'; note = 'Seeded topic'; type = 'topic' },
    @{ id = 'Infrastructure_Operations'; name = 'Infrastructure Operations'; note = 'Seeded topic'; type = 'topic' },
    @{ id = 'Incident_Problem_Management'; name = 'Incident Problem Management'; note = 'Seeded topic'; type = 'topic' }
)

$entities = $names | ForEach-Object {
    $id = Get-EntityId $_
    [ordered]@{
        id = $id
        name = Get-DisplayName $_
        note = 'Imported from provided relationship evidence seed'
        type = 'employee'
        ownerUserId = $id
        createdByUserId = 'system'
    }
}

$entities = @($entities) + (($skillSeeds + $contextSeeds) | ForEach-Object {
    [ordered]@{
        id = $_.id
        name = $_.name
        note = $_.note
        type = $_.type
        ownerUserId = ''
        createdByUserId = 'system'
    }
})

$relationshipEdges = $edgesByPair.Values |
    Sort-Object @{ Expression = { -$_.Weight } }, Source, Target |
    ForEach-Object {
        [ordered]@{
            id = "$($_.Source)-related-to-$($_.Target)"
            sourceEntityId = $_.Source
            targetEntityId = $_.Target
            kind = 'related-to'
            note = "weight=$($_.Weight); evidence=$($_.Evidence -join ',')"
        }
    }

$profileEdges = @(
    @{ source = 'Guido_Machmueller'; target = 'COMOS'; kind = 'has-skill'; note = 'Seeded profile skill' },
    @{ source = 'Guido_Machmueller'; target = 'GenAI'; kind = 'has-skill'; note = 'Seeded profile skill' },
    @{ source = 'Guido_Machmueller'; target = 'MCP'; kind = 'has-skill'; note = 'Seeded profile skill' },
    @{ source = 'Guido_Machmueller'; target = 'Caveman'; kind = 'has-skill'; note = 'Codex runtime skill visible in graph' },
    @{ source = 'Guido_Machmueller'; target = 'OpenAI_Docs'; kind = 'has-skill'; note = 'Codex runtime skill visible in graph' },
    @{ source = 'Guido_Machmueller'; target = 'Browser_Use'; kind = 'has-skill'; note = 'Codex runtime skill visible in graph' },
    @{ source = 'Guido_Machmueller'; target = 'AI_Architecture'; kind = 'interested-in'; note = 'Seeded profile topic' },
    @{ source = 'Matthias_Schmidt'; target = 'COMOS'; kind = 'has-skill'; note = 'Seeded profile skill' },
    @{ source = 'Matthias_Schmidt'; target = 'REST_API'; kind = 'has-skill'; note = 'Seeded profile skill' },
    @{ source = 'Christian_Jablonski'; target = 'SQL_Server'; kind = 'has-skill'; note = 'Seeded profile skill' },
    @{ source = 'Sachin_Kumar_Sharma'; target = 'Azure'; kind = 'has-skill'; note = 'Seeded profile skill' },
    @{ source = 'Vaibhav_Pandya'; target = 'IT_Service_Operations'; kind = 'in-department'; note = 'Seeded profile department' }
) | ForEach-Object {
    [ordered]@{
        id = "$($_.source)-$($_.kind)-$($_.target)"
        sourceEntityId = $_.source
        targetEntityId = $_.target
        kind = $_.kind
        note = $_.note
    }
}

$relationshipEdges = @($relationshipEdges) + $profileEdges

$document = [ordered]@{
    entities = $entities
    relationshipEdges = $relationshipEdges
}

$json = $document | ConvertTo-Json -Depth 6
Set-Content -Path 'data/socialgraph.json' -Value $json -Encoding UTF8
Set-Content -Path 'src/SocialGraph.Api/data/socialgraph.json' -Value $json -Encoding UTF8
foreach ($runtimePath in @(
    'src/SocialGraph.Api/bin/Debug/net10.0/data/socialgraph.json',
    'src/SocialGraph.Api/bin/Release/net10.0/data/socialgraph.json',
    'tests/SocialGraph.Api.Tests/bin/Release/net10.0/data/socialgraph.json'
)) {
    if (Test-Path (Split-Path -Parent $runtimePath)) {
        Set-Content -Path $runtimePath -Value $json -Encoding UTF8
    }
}

Write-Output "Generated $($entities.Count) entities and $($relationshipEdges.Count) relationship edges."
