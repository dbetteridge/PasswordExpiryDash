$GroupMemberList = Get-ADGroupMember 'Grouptocheck' -Recursive

$UserList = @()
ForEach ($member in $GroupMemberList){
    $user = (Get-ADUser -identity $member.distinguishedName -Properties samAccountName, name,"msDS-UserPasswordExpiryTimeComputed",enabled,EmailAddress, thumbnailphoto)
    
    if($user.Enabled -eq 'True'){
        $UserList += $user        
    }
} # Gathers all members of Grouptocheck and ensures the password expiry time property is available.
$remainingDaysList = @()
$expiryDateList = @()
$UserList = $UserList | sort -Unique

function passwordExpiryHTML(){
    $expiryObject = @()
    ForEach($user in $UserList) {   
        # Converts AD password expiry date to a normal time object
        $expiryDate = ([datetime]::FromFileTime($user."msDS-UserPasswordExpiryTimeComputed"))

        # Calculates remaining time till expiry date from current date
        $timeRemains = New-TimeSpan -Start (get-date) -End $expiryDate
    
        # Takes remaining days and truncates to allow use of modulo/ display to user
        # Selected truncation rather then rounding as showing less days is not really an issue, but too many days is 
        $remainingDays = [Math]::Truncate($timeRemains.Days)
       
        if($remainingDays -ge -365 -and $remainingDays -le 14){
       
            $item = New-Object -type PSCustomObject -Property @{
                'Username' = $user.samAccountName
                'Name' = $user.Name
                'ExpiryDate' = $expiryDate.ToString("dd/MM/yyyy hh:mm:ss")
                'RemainingDays' = $remainingDays
                'Photo' = [Convert]::ToBase64String($user.thumbnailphoto)
            }
            
            $expiryObject += $item
        }
    }
   
    
    
    
    $expiryObject | Select Username, Name, ExpiryDate, RemainingDays, Photo | ConvertTo-Json | Out-File pathtofile.json
}

passwordExpiryHTML