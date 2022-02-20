function [R,Q,CC] = rating_robust(r)

%r(NxM) is the rating matrix, where r(i,j) is the score of the object j from the user i
%If the user i does not rate the object i, then r(i,j)=0
%N is the number of users, M is the number of objects
%C is the credit of users
%Q is the quality of objects
%It_max is the maximum time of iterations
%ep is the threshold value
%P is the penalty coefficient

[N,M]=size(r);
C=ones(1,N);%the initial credit of users
Q=zeros(1,M);%the initial quality of object
It_max=100;
ep=0.0001;
P=100;
t=0;
while t<=It_max
    t=t+1;
    for j=1:M
        U=find(r(:,j));%the set of users who rate the object j
        nU=length(U);
        if nU==0
            Q(j)=Inf;
        else
            Q(j)=C(U)/sum(C(U))*r(U,j);%the weighted average score of the object j
            s(j)=(sum((r(U,j)-Q(j)).^2)/N)^0.5;%the standard deviation of the scores of obect j
        end
        for i=1:N
            if r(i,j)==0
                Z(i,j)=Inf;
            else
                Z(i,j)=(r(i,j)-Q(j))/s(j);%the Z-score of the score of object j from the user i
            end
        end
    end
    CC=C;
    for i=1:N
        V=find(r(i,:));%the set of objects who the user i rates
        nV=length(V);
        if nV==0
            C(i)=Inf;
        else
            C(i)=P.^(-mean(abs(Z(i,V))));%uptate the credit of users
        end
    end
    T=find(C<Inf);
    delta=(sum((CC(T)-C(T)).^2))^0.5; %calculate the change of C
    if delta<=ep
        break;
    end
end

[v,index]=sort(Q,'descend');
for i=1:M
    R(index(i))=i;
end